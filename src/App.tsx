import React, { useState } from 'react';
import { 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Battery, 
  Sun, 
  Home, 
  BarChart3, 
  Settings, 
  Bell,
  Activity,
  Power,
  Gauge,
  Edit3,
  X,
  Maximize2,
  Calendar,
  Clock,
  Moon,
  Menu
} from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState({});
  const [expandedChart, setExpandedChart] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarItems = [
    { id: 'overview', label: 'Visão Geral', icon: Home },
    { id: 'voltage', label: 'Tensão', icon: Zap },
    { id: 'current', label: 'Corrente', icon: Activity },
    { id: 'power', label: 'Potência', icon: Power },
    { id: 'energy', label: 'Energia', icon: Battery },
    { id: 'analytics', label: 'Análises', icon: BarChart3 },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const [chartData, setChartData] = useState({
    chart1: {
      title: 'Tensão Fase A (V)',
      value: '220.5',
      unit: 'V',
      data: [218, 220, 219, 221, 220, 222, 221, 220, 219, 220, 221, 220],
      detailedData: [218.2, 219.8, 220.1, 219.5, 221.2, 220.8, 222.1, 221.5, 220.3, 219.7, 220.9, 221.3, 220.6, 219.9, 220.4, 221.1, 220.2, 219.6, 220.7, 221.0, 220.5, 219.8, 220.3, 220.9],
      color: 'blue',
      trend: 'up',
      trendValue: '+0.5%',
      category: 'voltage',
      description: 'Monitoramento da tensão elétrica da Fase A em tempo real'
    },
    chart2: {
      title: 'Tensão Fase B (V)',
      value: '219.8',
      unit: 'V',
      data: [217, 219, 218, 220, 219, 221, 220, 219, 218, 219, 220, 219],
      detailedData: [217.5, 218.9, 219.2, 218.7, 220.1, 219.6, 221.0, 220.4, 219.1, 218.5, 219.7, 220.2, 219.4, 218.8, 219.9, 220.3, 219.0, 218.4, 219.6, 220.1, 219.3, 218.7, 219.8, 220.0],
      color: 'indigo',
      trend: 'stable',
      trendValue: '0.0%',
      category: 'voltage',
      description: 'Monitoramento da tensão elétrica da Fase B em tempo real'
    },
    chart3: {
      title: 'Corrente Fase A (A)',
      value: '15.8',
      unit: 'A',
      data: [14, 15, 16, 15, 17, 16, 15, 16, 15, 16, 15, 16],
      detailedData: [14.2, 15.1, 15.8, 15.3, 16.7, 16.2, 15.5, 15.9, 15.1, 16.3, 15.7, 16.1, 15.4, 14.9, 15.6, 16.0, 15.2, 14.8, 15.8, 16.2, 15.5, 15.0, 15.9, 16.1],
      color: 'emerald',
      trend: 'down',
      trendValue: '-2.1%',
      category: 'current',
      description: 'Medição da corrente elétrica da Fase A'
    },
    chart4: {
      title: 'Corrente Fase B (A)',
      value: '16.2',
      unit: 'A',
      data: [15, 16, 17, 16, 18, 17, 16, 17, 16, 17, 16, 17],
      detailedData: [15.3, 16.0, 16.9, 16.4, 17.8, 17.1, 16.6, 16.8, 16.0, 17.2, 16.5, 17.0, 16.3, 15.8, 16.7, 17.1, 16.1, 15.7, 16.9, 17.3, 16.4, 15.9, 17.0, 17.2],
      color: 'teal',
      trend: 'up',
      trendValue: '+1.2%',
      category: 'current',
      description: 'Medição da corrente elétrica da Fase B'
    },
    chart5: {
      title: 'Potência Ativa (kW)',
      value: '3.48',
      unit: 'kW',
      data: [3.2, 3.4, 3.6, 3.5, 3.7, 3.6, 3.5, 3.6, 3.4, 3.5, 3.4, 3.5],
      detailedData: [3.21, 3.35, 3.58, 3.42, 3.69, 3.54, 3.47, 3.61, 3.38, 3.52, 3.43, 3.56, 3.39, 3.33, 3.51, 3.64, 3.41, 3.29, 3.57, 3.62, 3.45, 3.31, 3.53, 3.59],
      color: 'purple',
      trend: 'up',
      trendValue: '+1.8%',
      category: 'power',
      description: 'Potência ativa consumida pelo sistema'
    },
    chart6: {
      title: 'Potência Reativa (kVAr)',
      value: '0.85',
      unit: 'kVAr',
      data: [0.8, 0.9, 0.7, 0.8, 0.9, 0.8, 0.7, 0.8, 0.9, 0.8, 0.8, 0.9],
      detailedData: [0.82, 0.87, 0.74, 0.81, 0.93, 0.79, 0.71, 0.84, 0.88, 0.76, 0.83, 0.91, 0.78, 0.73, 0.86, 0.89, 0.75, 0.80, 0.92, 0.77, 0.85, 0.72, 0.87, 0.90],
      color: 'orange',
      trend: 'up',
      trendValue: '+0.3%',
      category: 'power',
      description: 'Potência reativa do sistema elétrico'
    },
    chart7: {
      title: 'Energia Consumida (kWh)',
      value: '1,245.8',
      unit: 'kWh',
      data: [1200, 1210, 1220, 1225, 1230, 1235, 1240, 1242, 1244, 1245, 1245, 1246],
      detailedData: [1200.5, 1205.2, 1210.8, 1215.3, 1220.7, 1225.1, 1230.4, 1235.0, 1240.2, 1242.6, 1244.1, 1245.3, 1245.7, 1246.0, 1246.2, 1246.5, 1246.8, 1247.0, 1247.3, 1247.6, 1247.9, 1248.1, 1248.4, 1248.7],
      color: 'red',
      trend: 'up',
      trendValue: '+12.5 kWh',
      category: 'energy',
      description: 'Energia total consumida acumulada'
    },
    chart8: {
      title: 'Energia Gerada (kWh)',
      value: '892.3',
      unit: 'kWh',
      data: [850, 860, 870, 875, 880, 885, 888, 890, 891, 892, 892, 893],
      detailedData: [850.2, 855.8, 861.3, 866.7, 872.1, 877.4, 882.6, 885.9, 888.2, 890.1, 891.5, 892.3, 892.7, 893.0, 893.2, 893.5, 893.8, 894.0, 894.3, 894.6, 894.9, 895.1, 895.4, 895.7],
      color: 'green',
      trend: 'up',
      trendValue: '+8.2 kWh',
      category: 'energy',
      description: 'Energia gerada pelo sistema solar'
    }
  });

  const updateChartData = (chartId, field, value) => {
    setChartData(prev => ({
      ...prev,
      [chartId]: {
        ...prev[chartId],
        [field]: value
      }
    }));
  };

  const toggleEditMode = (chartId) => {
    setEditMode(prev => ({
      ...prev,
      [chartId]: !prev[chartId]
    }));
  };

  const getFilteredCharts = () => {
    if (activeTab === 'overview') {
      return Object.entries(chartData);
    }
    return Object.entries(chartData).filter(([_, chart]) => chart.category === activeTab);
  };

  const SimpleChart = ({ data, type = 'line', height = 80, color = 'emerald' }) => {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;
    
    if (type === 'line') {
      const points = data.map((value, index) => 
        `${(index / (data.length - 1)) * 100},${100 - ((value - minValue) / range) * 80}`
      ).join(' ');
      
      const colorMap = {
        emerald: '#10b981',
        blue: '#3b82f6',
        purple: '#8b5cf6',
        orange: '#f59e0b',
        green: '#22c55e',
        red: '#ef4444',
        indigo: '#6366f1',
        pink: '#ec4899',
        teal: '#14b8a6'
      };
      
      return (
        <div className="w-full" style={{ height }}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polyline
              fill="none"
              stroke={colorMap[color]}
              strokeWidth="2"
              points={points}
            />
            <defs>
              <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={colorMap[color]} stopOpacity="0.3"/>
                <stop offset="100%" stopColor={colorMap[color]} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <polygon
              fill={`url(#gradient-${color})`}
              points={`0,100 ${points} 100,100`}
            />
          </svg>
        </div>
      );
    }
    
    return (
      <div className="flex items-end justify-between h-full space-x-0.5 sm:space-x-1">
        {data.map((value, index) => (
          <div
            key={index}
            className={`bg-${color}-500 rounded-t transition-all duration-300 hover:bg-${color}-600`}
            style={{ 
              height: `${((value - minValue) / range) * 100}%`,
              width: `${100 / data.length - 1}%`
            }}
          />
        ))}
      </div>
    );
  };

  const DetailedChart = ({ data, color = 'emerald', title }) => {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;
    
    const points = data.map((value, index) => 
      `${(index / (data.length - 1)) * 100},${100 - ((value - minValue) / range) * 80}`
    ).join(' ');
    
    const colorMap = {
      emerald: '#10b981',
      blue: '#3b82f6',
      purple: '#8b5cf6',
      orange: '#f59e0b',
      green: '#22c55e',
      red: '#ef4444',
      indigo: '#6366f1',
      pink: '#ec4899',
      teal: '#14b8a6'
    };
    
    return (
      <div className="w-full h-64 sm:h-80">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Grid lines */}
          <defs>
            <pattern id={`grid-${color}`} width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke={darkMode ? "#374151" : "#f3f4f6"} strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill={`url(#grid-${color})`} />
          
          {/* Chart line */}
          <polyline
            fill="none"
            stroke={colorMap[color]}
            strokeWidth="2"
            points={points}
          />
          
          {/* Area fill */}
          <defs>
            <linearGradient id={`detailed-gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colorMap[color]} stopOpacity="0.3"/>
              <stop offset="100%" stopColor={colorMap[color]} stopOpacity="0"/>
            </linearGradient>
          </defs>
          <polygon
            fill={`url(#detailed-gradient-${color})`}
            points={`0,100 ${points} 100,100`}
          />
          
          {/* Data points */}
          {data.map((value, index) => (
            <circle
              key={index}
              cx={(index / (data.length - 1)) * 100}
              cy={100 - ((value - minValue) / range) * 80}
              r="1"
              fill={colorMap[color]}
              className="hover:r-2 transition-all duration-200"
            />
          ))}
        </svg>
        
        {/* Y-axis labels */}
        <div className={`flex justify-between text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <span>{minValue.toFixed(1)}</span>
          <span>{((minValue + maxValue) / 2).toFixed(1)}</span>
          <span>{maxValue.toFixed(1)}</span>
        </div>
      </div>
    );
  };

  const EditableMetricCard = ({ chartId, chartInfo, isCompact = false }) => (
    <div 
      className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-4 sm:p-6 hover:shadow-md transition-all duration-200 cursor-pointer ${
        isCompact ? '' : 'hover:scale-105'
      }`}
      onClick={() => !isCompact && setExpandedChart(chartId)}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex-1">
          {editMode[chartId] ? (
            <input
              type="text"
              value={chartInfo.title}
              onChange={(e) => updateChartData(chartId, 'title', e.target.value)}
              className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-300 border-gray-600' : 'text-gray-600 border-gray-300'} bg-transparent border-b focus:border-blue-500 outline-none w-full`}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <h3 className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{chartInfo.title}</h3>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {!isCompact && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpandedChart(chartId);
              }}
              className={`p-1 ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors duration-200`}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleEditMode(chartId);
            }}
            className={`p-1 ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors duration-200`}
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <div className={`flex items-center text-xs font-medium ${
            chartInfo.trend === 'up' ? 'text-green-600' : 
            chartInfo.trend === 'down' ? 'text-red-600' : 'text-gray-500'
          }`}>
            {chartInfo.trend === 'up' && <TrendingUp className="w-3 h-3 mr-1" />}
            {chartInfo.trend === 'down' && <TrendingDown className="w-3 h-3 mr-1" />}
            {editMode[chartId] ? (
              <input
                type="text"
                value={chartInfo.trendValue}
                onChange={(e) => updateChartData(chartId, 'trendValue', e.target.value)}
                className={`w-12 sm:w-16 text-xs bg-transparent border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'} focus:border-blue-500 outline-none`}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              chartInfo.trendValue
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-baseline mb-3 sm:mb-4">
        {editMode[chartId] ? (
          <div className="flex items-baseline" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={chartInfo.value}
              onChange={(e) => updateChartData(chartId, 'value', e.target.value)}
              className={`text-xl sm:text-3xl font-bold text-${chartInfo.color}-600 bg-transparent border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'} focus:border-blue-500 outline-none w-16 sm:w-24`}
            />
            <input
              type="text"
              value={chartInfo.unit}
              onChange={(e) => updateChartData(chartId, 'unit', e.target.value)}
              className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400 border-gray-600' : 'text-gray-500 border-gray-300'} ml-1 bg-transparent border-b focus:border-blue-500 outline-none w-8 sm:w-12`}
            />
          </div>
        ) : (
          <>
            <span className={`text-xl sm:text-3xl font-bold text-${chartInfo.color}-600`}>
              {chartInfo.value}
            </span>
            <span className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-1`}>{chartInfo.unit}</span>
          </>
        )}
      </div>
      
      <div className={isCompact ? "h-24 sm:h-32" : "h-16 sm:h-20"}>
        {isCompact ? (
          <DetailedChart 
            data={chartInfo.detailedData} 
            color={chartInfo.color}
            title={chartInfo.title}
          />
        ) : (
          <SimpleChart 
            data={chartInfo.data} 
            type="line" 
            color={chartInfo.color}
          />
        )}
      </div>
      
      {editMode[chartId] && (
        <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`} onClick={(e) => e.stopPropagation()}>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Dados do gráfico (separados por vírgula):</p>
          <textarea
            value={chartInfo.data.join(', ')}
            onChange={(e) => {
              const newData = e.target.value.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
              updateChartData(chartId, 'data', newData);
            }}
            className={`w-full text-xs ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-200'} border rounded p-2 resize-none`}
            rows="2"
          />
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2 mt-2`}>Dados detalhados (separados por vírgula):</p>
          <textarea
            value={chartInfo.detailedData.join(', ')}
            onChange={(e) => {
              const newData = e.target.value.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
              updateChartData(chartId, 'detailedData', newData);
            }}
            className={`w-full text-xs ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-200'} border rounded p-2 resize-none`}
            rows="3"
          />
        </div>
      )}
    </div>
  );

  const ExpandedChartModal = ({ chartId, chartInfo }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className={`p-4 sm:p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{chartInfo.title}</h2>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1 text-sm sm:text-base`}>{chartInfo.description}</p>
            </div>
            <button
              onClick={() => setExpandedChart(null)}
              className={`p-2 ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors duration-200`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Valor Atual</span>
                <div className={`flex items-center text-xs font-medium ${
                  chartInfo.trend === 'up' ? 'text-green-600' : 
                  chartInfo.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {chartInfo.trend === 'up' && <TrendingUp className="w-3 h-3 mr-1" />}
                  {chartInfo.trend === 'down' && <TrendingDown className="w-3 h-3 mr-1" />}
                  {chartInfo.trendValue}
                </div>
              </div>
              <div className="flex items-baseline">
                <span className={`text-2xl sm:text-3xl font-bold text-${chartInfo.color}-600`}>
                  {chartInfo.value}
                </span>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-1`}>{chartInfo.unit}</span>
              </div>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
              <div className="flex items-center mb-2">
                <Clock className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'} mr-2`} />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Última Atualização</span>
              </div>
              <p className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {new Date().toLocaleTimeString('pt-BR')}
              </p>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
              <div className="flex items-center mb-2">
                <BarChart3 className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'} mr-2`} />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Pontos de Dados</span>
              </div>
              <p className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {chartInfo.detailedData.length}
              </p>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 sm:p-6`}>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>Gráfico Detalhado</h3>
            <DetailedChart 
              data={chartInfo.detailedData} 
              color={chartInfo.color}
              title={chartInfo.title}
            />
          </div>
          
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Máximo</p>
              <p className={`text-lg font-semibold text-${chartInfo.color}-600`}>
                {Math.max(...chartInfo.detailedData).toFixed(2)} {chartInfo.unit}
              </p>
            </div>
            <div className="text-center">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Mínimo</p>
              <p className={`text-lg font-semibold text-${chartInfo.color}-600`}>
                {Math.min(...chartInfo.detailedData).toFixed(2)} {chartInfo.unit}
              </p>
            </div>
            <div className="text-center">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Média</p>
              <p className={`text-lg font-semibold text-${chartInfo.color}-600`}>
                {(chartInfo.detailedData.reduce((a, b) => a + b, 0) / chartInfo.detailedData.length).toFixed(2)} {chartInfo.unit}
              </p>
            </div>
            <div className="text-center">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Variação</p>
              <p className={`text-lg font-semibold text-${chartInfo.color}-600`}>
                {(Math.max(...chartInfo.detailedData) - Math.min(...chartInfo.detailedData)).toFixed(2)} {chartInfo.unit}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const getCategoryTitle = () => {
    const titles = {
      overview: 'Visão Geral do Sistema',
      voltage: 'Monitoramento de Tensão',
      current: 'Monitoramento de Corrente',
      power: 'Monitoramento de Potência',
      energy: 'Monitoramento de Energia'
    };
    return titles[activeTab] || 'Dashboard';
  };

  const getCategoryDescription = () => {
    const descriptions = {
      overview: 'Monitoramento completo de todos os parâmetros elétricos',
      voltage: 'Análise detalhada das tensões por fase',
      current: 'Medição das correntes elétricas do sistema',
      power: 'Controle de potência ativa e reativa',
      energy: 'Gestão do consumo e geração de energia'
    };
    return descriptions[activeTab] || 'Monitoramento em tempo real';
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex transition-colors duration-300`}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 ${darkMode ? 'bg-gray-800' : 'bg-slate-800'} text-white p-4 sm:p-6 flex-shrink-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex items-center mb-8">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
            <Gauge className="w-5 h-5" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold">Multimedidor</h1>
        </div>
        
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-left transition-colors duration-200 text-sm sm:text-base ${
                activeTab === item.id 
                  ? 'bg-emerald-600 text-white' 
                  : `text-gray-300 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-700'} hover:text-white`
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8">
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-slate-700'} rounded-lg p-4`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Status do Medidor</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-xs text-gray-400">Conectado e operacional</p>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className={`lg:hidden mr-3 p-2 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h2 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{getCategoryTitle()}</h2>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm sm:text-base`}>{getCategoryDescription()}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setEditMode({})}
              className="px-3 sm:px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center text-sm sm:text-base"
            >
              <Edit3 className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Modo Edição</span>
            </button>
            <button className={`relative p-2 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors duration-200`}>
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <div className={`w-8 h-8 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded-full`}></div>
          </div>
        </div>

        {/* Instructions */}
        <div className={`${darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4 mb-6 sm:mb-8`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Edit3 className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mt-0.5`} />
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>Como usar o dashboard</h3>
              <p className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-700'} mt-1`}>
                Clique em qualquer gráfico para expandir e ver detalhes. Use a sidebar para filtrar por categoria. 
                Clique no ícone de edição para personalizar títulos, valores e dados dos gráficos.
              </p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className={`grid gap-6 mb-8 ${
          activeTab === 'overview' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' 
            : 'grid-cols-1 lg:grid-cols-2'
        }`}>
          {getFilteredCharts().map(([chartId, chartInfo]) => (
            <EditableMetricCard 
              key={chartId}
              chartId={chartId}
              chartInfo={chartInfo}
              isCompact={activeTab !== 'overview'}
            />
          ))}
        </div>

        {/* Summary Section - Only show on overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* System Overview */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-4 sm:p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Resumo do Sistema</h3>
                <Activity className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Potência Total</span>
                  <span className="text-sm font-medium text-emerald-600">3.48 kW</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Eficiência</span>
                  <span className="text-sm font-medium text-blue-600">97%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Qualidade</span>
                  <span className="text-sm font-medium text-green-600">Excelente</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</span>
                  <span className="text-sm font-medium text-emerald-600">Normal</span>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-4 sm:p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Alertas</h3>
                <Bell className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <div className="space-y-3">
                <div className={`flex items-center p-3 ${darkMode ? 'bg-green-900/20' : 'bg-green-50'} rounded-lg`}>
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-green-300' : 'text-green-800'}`}>Sistema Normal</p>
                    <p className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'}`}>Todos os parâmetros dentro da faixa</p>
                  </div>
                </div>
                <div className={`flex items-center p-3 ${darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'} rounded-lg`}>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>Monitoramento Ativo</p>
                    <p className={`text-xs ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>Coletando dados em tempo real</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Export */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-4 sm:p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Exportar Dados</h3>
                <BarChart3 className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 text-sm sm:text-base">
                  Relatório Diário
                </button>
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base">
                  Relatório Mensal
                </button>
                <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm sm:text-base">
                  Dados CSV
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Expanded Chart Modal */}
      {expandedChart && (
        <ExpandedChartModal 
          chartId={expandedChart}
          chartInfo={chartData[expandedChart]}
        />
      )}
    </div>
  );
};

export default Dashboard;