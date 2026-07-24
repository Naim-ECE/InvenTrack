import { Doughnut } from 'react-chartjs-2';

interface DoughnutChartProps {
  labels: string[];
  data: number[];
  colors?: string[];
  centerText?: string;
}

export default function DoughnutChartComponent({ labels, data, colors = ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'], centerText }: DoughnutChartProps) {
  return (
    <div className="relative">
      <Doughnut
        data={{
          labels,
          datasets: [{ data, backgroundColor: colors.slice(0, data.length), borderWidth: 0, hoverOffset: 4 }],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: { position: 'bottom', labels: { color: '#9CA3AF', font: { size: 11 }, usePointStyle: true, padding: 16 } },
          },
        }}
      />
      {centerText && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-xl font-bold text-[#F9FAFB] font-[Montserrat]">{centerText}</span>
        </div>
      )}
    </div>
  );
}
