import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get('https://lobby.cash/api/gaugeRewards/cvx/all/1686182400')
      .then(res => {
        let totalValue = 0;
        console.log("gaugeRewards: ");
        console.log(res.data.data.gaugeRewards);
        const tempData = Object.entries(res.data.data.gaugeRewards).map(([key, value]) => {
          console.log("key: " + key);
          console.log("totalValue: " + value.totalValue);
          totalValue += value.totalValue;
          return { name: key, totalValue: value.totalValue };
        });
        const percentageData = tempData.map(obj => ({
          ...obj,
          percent: (obj.totalValue / totalValue) * 100,
        }));
        setData(percentageData);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <PieChart width={800} height={400}>
        <Pie
          data={data}
          cx={120}
          cy={200}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="totalValue"
        >
          {
            data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
          }
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}

export default App;
