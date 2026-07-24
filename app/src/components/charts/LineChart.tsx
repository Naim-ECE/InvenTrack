import { Line } from 'react-chartjs-2';

interface LineChartProps {
  labels: string[];
  data: number[];
  previous?: number[];
  color?: string;
  fill?: boolean;
}

export default function LineChartComponent({ labels, data, previous, color = '#22C55E', fill = true }: LineChartProps) {
  const datasets: any[] = [{
    label: 'Current',
    data,
    borderColor: color,
    backgroundColor: fill ? `${color}20` : 'transparent',
    borderWidth: 2,
    tension: 0.4,
    pointRadius: 3,
    pointHoverRadius: 5,
    pointBackgroundColor: color,
    fill,
  }];

  if (previous) {
    datasets.push({
      label: 'Previous',
      data: previous,
      borderColor: '#3B82F6',
      borderWidth: 2,
      borderDash: [5, 5],
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 4,
      fill: false,
    });
  }

  return (
    <Line
      data={{ labels, datasets }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: !!previous, labels: { color: '#9CA3AF', font: { size: 12 }, usePointStyle: true } },
        },
        scales: {
          x: { grid: { color: '#1F2937' }, ticks: { color: '#6B7280', font: { size: 11 } } },
          y: { grid: { color: '#1F2937' }, ticks: { color: '#6B7280', font: { size: 11 } } },
        },
      }}
    />
  );
}
