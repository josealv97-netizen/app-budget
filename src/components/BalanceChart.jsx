import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const BalanceChart = ({ data, direction }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={direction === 'future' ? '#8b5cf6' : '#3b82f6'} stopOpacity={0.1} />
                        <stop offset="95%" stopColor={direction === 'future' ? '#8b5cf6' : '#3b82f6'} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={30} // Prevent overlap on long ranges
                />
                <YAxis
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    tickFormatter={(val) => `€${val}`}
                    tickLine={false}
                    axisLine={false}
                    width={50}
                />
                <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`€${value.toLocaleString()}`, 'Solde']}
                    labelStyle={{ color: '#64748b', fontSize: '12px' }}
                />
                <Area
                    type="monotone"
                    dataKey="balance"
                    stroke={direction === 'future' ? '#8b5cf6' : '#3b82f6'}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorBalance)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};
