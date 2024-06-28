import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#88CC00', '#E54322', '#0088FE', '#FFBB28'];
export const StatisticsPieChart = ({data}: {data: any}) => {
    return (
        <div style={{width: '100%'}}>
            <PieChart width={400} height={250} onMouseEnter={() => {
            }}>
                <Pie
                    data={data}
                    cx={120}
                    cy={120}
                    innerRadius={60}
                    outerRadius={100}
                    fill="#383b4a"
                    stroke="#383b4a"
                    paddingAngle={0}
                    dataKey="value"
                >
                    {data.map((entry: string, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </div>
    );
}
