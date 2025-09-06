'use client';

interface KpiCardsProps {
  data: {
    totalLeads: number;
    consultBooked: number;
    consultShown: number;
    totalRevenue: number;
    totalSpend: number;
    roi: number;
    leadToConsultRate: number;
    consultToShowRate: number;
    showToWonRate: number;
  };
}

export default function KpiCards({ data }: KpiCardsProps) {
  const cards = [
    {
      title: 'Total Leads',
      value: data.totalLeads,
      change: null,
      color: 'blue',
    },
    {
      title: 'Consultations Booked',
      value: data.consultBooked,
      change: data.leadToConsultRate,
      changeLabel: 'Lead → Consult Rate',
      color: 'purple',
    },
    {
      title: 'Consultations Shown',
      value: data.consultShown,
      change: data.consultToShowRate,
      changeLabel: 'Consult → Show Rate',
      color: 'indigo',
    },
    {
      title: 'Revenue',
      value: `$${data.totalRevenue.toLocaleString()}`,
      change: data.showToWonRate,
      changeLabel: 'Show → Won Rate',
      color: 'green',
    },
    {
      title: 'Ad Spend',
      value: `$${data.totalSpend.toLocaleString()}`,
      change: null,
      color: 'red',
    },
    {
      title: 'ROI',
      value: `${data.roi.toFixed(1)}%`,
      change: null,
      color: data.roi >= 0 ? 'green' : 'red',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      red: 'bg-red-50 text-red-700 border-red-200',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`card border-l-4 ${getColorClasses(card.color)}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-75">{card.title}</p>
              <p className="text-2xl font-bold">{card.value}</p>
              {card.change !== null && card.changeLabel && (
                <p className="text-xs opacity-75 mt-1">
                  {card.changeLabel}: {card.change.toFixed(1)}%
                </p>
              )}
            </div>
            <div className="text-3xl opacity-50">
              {card.title === 'Total Leads' && '👥'}
              {card.title === 'Consultations Booked' && '📅'}
              {card.title === 'Consultations Shown' && '✅'}
              {card.title === 'Revenue' && '💰'}
              {card.title === 'Ad Spend' && '📊'}
              {card.title === 'ROI' && '📈'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
