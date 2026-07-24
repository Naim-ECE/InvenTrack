import { Bar } from 'react-chartjs-2';

interface BarChartProps {
  labels: string[];
  data: number[];
  horizontal?: boolean;
  color?: string;
}

export default function BarChartComponent({ labels, data, horizontal = false, color = '#22C55E' }: BarChartProps) {
  return (
    <Bar
      data={{
        labels,
        datasets: [{
          data,
          backgroundColor: color,
          hoverBackgroundColor: color + 'CC',
          borderRadius: 4,
          borderSkipped: false,
        }],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: horizontal ? 'y' : 'x',
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#6B7280', font: { size: 11 } } },
          y: { grid: { color: '#1F2937' }, ticks: { color: '#6B7280', font: { size: 11 } } },
        },
      }}
    />
  );
}
