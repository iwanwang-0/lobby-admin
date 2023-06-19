import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get('https://lobby.page/api/gaugeRewards/cvx/all/1686182400')
      .then(res => {
        let totalValue = 0;
        const tempData = Object.entries(res.data.data.gaugeRewards).map(([key, value]) => {
          totalValue += value.totalValue;
          return { name: key, totalValue: value.totalValue };
        });
        // sort the data by totalValue in descending order
        tempData.sort((a, b) => b.totalValue - a.totalValue);
        const percentageData = tempData.map(obj => ({
          ...obj,
          percent: Number(((obj.totalValue / totalValue) * 100).toFixed(2)),
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

  const CustomizedAxisTick = props => {
    const { x, y, payload } = props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-45)">
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <div>
      <BarChart
        width={window.innerWidth - 100}
        height={800}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 200,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" height={200} tick={<CustomizedAxisTick />} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalValue" fill="#8884d8" minPointSize={5} />
      </BarChart>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Total Value</th>
            <th>Percent (%)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.totalValue}</td>
              <td>{item.percent.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
