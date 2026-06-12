import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Ruler, 
  ClipboardList, 
  Settings, 
  Plus, 
  Save,
  Building2,
  HardHat,
  MapPin,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Printer,
  Download,
  Trash2,
  ChevronLeft,
  Edit,
  Unlock,
  Pencil
} from 'lucide-react';

const INITIAL_PROJECT_INFO = {
  obra: 'PORTO CARIOCA',
  contratada: 'PAULO - INFRA',
  contratante: 'EMCCAMP',
  endereco: 'SANTO CRISTO',
  responsavel: 'BRUNO OLIVEIRA'
};

const INITIAL_SERVICES = [
  { id: 1, etapa: 'MOVIMENTO DE TERRA', descricao: 'SERVIÇO DE ESCAVAÇÃO DE VALA', unidade: 'M³', valorUnit: 21.46, qtdTotal: 1500 },
  { id: 2, etapa: 'MOVIMENTO DE TERRA', descricao: 'SERVIÇO DE NIVELAMENTO / COMPACTAÇÃO DE FUNDO DE VALA', unidade: 'M²', valorUnit: 6.44, qtdTotal: 800 },
  { id: 3, etapa: 'MOVIMENTO DE TERRA', descricao: 'SERVIÇO DE REATERRO', unidade: 'M³', valorUnit: 23.42, qtdTotal: 1200 },
  { id: 4, etapa: 'DRENAGEM', descricao: 'SERVIÇO DE INSTALAÇÃO DE CX DE REGISTRO 145 X 90 CM', unidade: 'UNID.', valorUnit: 850.00, qtdTotal: 15 },
  { id: 5, etapa: 'DRENAGEM', descricao: 'SERVIÇO DE INSTALAÇÃO DE CX DE GORDURA 288L', unidade: 'UNID.', valorUnit: 356.93, qtdTotal: 10 },
  { id: 6, etapa: 'ELÉTRICA', descricao: 'SERVIÇO DE INSTALAÇÃO DE CX DE PASSAGEM 40X40 CM', unidade: 'UNID.', valorUnit: 116.33, qtdTotal: 50 },
  { id: 7, etapa: 'DRENAGEM', descricao: 'SERVIÇO DE INSTALAÇÃO DE CI Ø110 - ESGOTO', unidade: 'UNID.', valorUnit: 356.93, qtdTotal: 30 },
];

const INITIAL_MEASUREMENTS = [
  {
    id: 1, name: 'Medição 1', date: '2023-08-15', status: 'fechada',
    items: [
      { serviceId: 1, qtd: 300 }, { serviceId: 2, qtd: 150 }, { serviceId: 4, qtd: 2 }
    ]
  },
  {
    id: 2, name: 'Medição 2', date: '2023-09-15', status: 'fechada',
    items: [
      { serviceId: 1, qtd: 400 }, { serviceId: 3, qtd: 200 }, { serviceId: 5, qtd: 4 }
    ]
  },
  {
    id: 3, name: 'Medição 3', date: '2023-10-15', status: 'aberta',
    items: [
      { serviceId: 1, qtd: 200 }, { serviceId: 6, qtd: 10 }
    ]
  }
];

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(value);
};

const formatPercent = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 2 }).format(value);
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projectInfo, setProjectInfo] = useState(INITIAL_PROJECT_INFO);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [measurements, setMeasurements] = useState(INITIAL_MEASUREMENTS);
  const [activeMeasurementId, setActiveMeasurementId] = useState(3);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, password: '', error: '' });

  // Estados dos Modais do Cabeçalho e Novos Serviços
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
  const [tempProjectInfo, setTempProjectInfo] = useState(INITIAL_PROJECT_INFO);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [newService, setNewService] = useState({ etapa: '', descricao: '', unidade: 'UN', valorUnit: 0, qtdTotal: 0 });

  // Estados do Modal de Edição de Serviços
  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // --- FUNÇÕES DE MEDIÇÃO ---
  const handleNewMeasurement = () => {
    const newId = measurements.length > 0 ? Math.max(...measurements.map(m => m.id)) + 1 : 1;
    const newMed = {
      id: newId,
      name: `Medição ${newId}`,
      date: new Date().toISOString().split('T')[0],
      status: 'aberta',
      items: []
    };
    setMeasurements([...measurements, newMed]);
    setActiveMeasurementId(newId);
  };

  const handleToggleStatus = (status) => {
    setMeasurements(measurements.map(m => 
      m.id === activeMeasurementId ? { ...m, status } : m
    ));
  };

  const executeDeleteMeasurement = () => {
    if (deleteModal.password !== 'admin123') {
      setDeleteModal({ ...deleteModal, error: 'Senha incorreta!' });
      return;
    }
    const filtered = measurements.filter(m => m.id !== deleteModal.id);
    setMeasurements(filtered);
    if (activeMeasurementId === deleteModal.id) {
      setActiveMeasurementId(filtered.length > 0 ? filtered[filtered.length - 1].id : null);
    }
    setDeleteModal({ isOpen: false, id: null, password: '', error: '' });
  };

  // --- FUNÇÕES DE SERVIÇOS E CABEÇALHO ---
  const handleSaveProjectInfo = () => {
    setProjectInfo(tempProjectInfo);
    setIsHeaderModalOpen(false);
  };

  const handleAddService = () => {
    const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
    setServices([
      ...services, 
      { ...newService, id: newId, valorUnit: Number(newService.valorUnit), qtdTotal: Number(newService.qtdTotal) }
    ]);
    setIsServiceModalOpen(false);
    setNewService({ etapa: '', descricao: '', unidade: 'UN', valorUnit: 0, qtdTotal: 0 });
  };

  const openEditServiceModal = (service) => {
    setEditingService({ ...service });
    setIsEditServiceModalOpen(true);
  };

  const handleUpdateService = () => {
    setServices(services.map(s => 
      s.id === editingService.id 
        ? { ...editingService, valorUnit: Number(editingService.valorUnit), qtdTotal: Number(editingService.qtdTotal) }
        : s
    ));
    setIsEditServiceModalOpen(false);
    setEditingService(null);
  };

  // --- CÁLCULOS GLOBAIS ---
  const globalStats = useMemo(() => {
    let valorTotalContrato = 0;
    let valorTotalMedido = 0;

    services.forEach(srv => {
      valorTotalContrato += srv.qtdTotal * srv.valorUnit;
    });

    measurements.forEach(med => {
      med.items.forEach(item => {
        const service = services.find(s => s.id === item.serviceId);
        if (service) {
          valorTotalMedido += item.qtd * service.valorUnit;
        }
      });
    });

    const saldoTotal = valorTotalContrato - valorTotalMedido;
    const percentMedido = valorTotalContrato > 0 ? valorTotalMedido / valorTotalContrato : 0;

    return { valorTotalContrato, valorTotalMedido, saldoTotal, percentMedido };
  }, [services, measurements]);

  // --- EXPORTAÇÕES ---
  const exportExcelFormatted = () => {
    const activeMed = measurements.find(m => m.id === activeMeasurementId);
    
    const exportRows = services.map(service => {
      let qtdAcumuladaAnterior = 0;
      measurements.filter(m => m.id < activeMeasurementId).forEach(m => {
        const item = m.items.find(i => i.serviceId === service.id);
        if (item) qtdAcumuladaAnterior += item.qtd;
      });

      const currentItem = activeMed?.items.find(i => i.serviceId === service.id);
      const qtdAtual = currentItem ? currentItem.qtd : 0;
      const saldoAnteriorQtd = service.qtdTotal - qtdAcumuladaAnterior;
      const saldoAtualQtd = saldoAnteriorQtd - qtdAtual;
      const valorMedicaoAtual = qtdAtual * service.valorUnit;
      const acumuladoAtual = qtdAcumuladaAnterior + qtdAtual;

      return {
        ...service, qtdAcumuladaAnterior, saldoAnteriorQtd, qtdAtual, valorMedicaoAtual, saldoAtualQtd, acumuladoAtual
      };
    });

    const tableHTML = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <style>
          table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 12px; }
          th, td { border: 1px solid #cbd5e1; padding: 6px; text-align: right; }
          th { text-align: center; font-weight: bold; background-color: #f1f5f9; }
          .text-left { text-align: left; }
          .bg-blue { background-color: #dbeafe; color: #1e3a8a; }
          .bg-orange { background-color: #ffedd5; color: #c2410c; }
          .bg-green { background-color: #d1fae5; color: #047857; }
          .bg-red { background-color: #fee2e2; color: #b91c1c; }
          .header-title { font-size: 16px; font-weight: bold; text-align: left; border: none; }
        </style>
      </head>
      <body>
        <table>
          <tr><td colspan="9" class="header-title">OBRA: ${projectInfo.obra}</td></tr>
          <tr><td colspan="9" class="header-title">EMPREITEIRO: ${projectInfo.contratada}</td></tr>
          <tr><td colspan="9" class="header-title">MEDIÇÃO: ${activeMed?.name} (${new Date(activeMed?.date).toLocaleDateString('pt-BR')})</td></tr>
          <tr><td colspan="9"></td></tr>
          <tr>
            <th class="text-left">Descrição do Serviço</th>
            <th>Unid.</th>
            <th>Total Planejado</th>
            <th class="bg-orange">Acumulado Ant.</th>
            <th class="bg-orange">Saldo Anterior</th>
            <th class="bg-blue">Qtd. a Medir</th>
            <th class="bg-blue">Total R$ (Período)</th>
            <th class="bg-green">Acumulado Atual</th>
            <th class="bg-green">Saldo Final</th>
          </tr>
          ${exportRows.map(r => `
            <tr>
              <td class="text-left">${r.descricao}</td>
              <td style="text-align: center">${r.unidade}</td>
              <td>${r.qtdTotal}</td>
              <td class="bg-orange">${r.qtdAcumuladaAnterior}</td>
              <td class="bg-orange">${r.saldoAnteriorQtd}</td>
              <td class="bg-blue" style="font-weight: bold;">${r.qtdAtual}</td>
              <td class="bg-blue" style="font-weight: bold;">${r.valorMedicaoAtual}</td>
              <td class="bg-green">${r.acumuladoAtual}</td>
              <td class="${r.saldoAtualQtd < 0 ? 'bg-red' : 'bg-green'}" style="font-weight: bold;">${r.saldoAtualQtd}</td>
            </tr>
          `).join('')}
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([tableHTML], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Planilha_${activeMed?.name.replace(' ', '_')}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    if (!window.html2pdf) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      document.body.appendChild(script);
      script.onload = () => executePDF();
    } else {
      executePDF();
    }
  };

  const executePDF = () => {
    const activeMed = measurements.find(m => m.id === activeMeasurementId);
    const element = document.getElementById('area-medicao-pdf');
    if (!element) return;
    
    const clone = element.cloneNode(true);
    const ignores = clone.querySelectorAll('[data-html2canvas-ignore="true"]');
    ignores.forEach(el => el.remove());
    
    const inputs = clone.querySelectorAll('input[type="number"]');
    const spans = clone.querySelectorAll('.print\\:block');
    inputs.forEach(el => el.remove());
    spans.forEach(el => { 
      el.classList.remove('hidden'); 
      el.style.display = 'block'; 
    });

    const opt = {
      margin:       5,
      filename:     `Relatorio_${activeMed?.name.replace(' ', '_')}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    window.html2pdf().set(opt).from(clone).save();
  };

  // --- RENDERIZAÇÃO DAS ABAS ---

  const renderDashboard = () => {
    let accumulated = 0;
    const chartData = measurements.map((med, index) => {
      let medValue = 0;
      med.items.forEach(item => {
        const service = services.find(s => s.id === item.serviceId);
        if (service) medValue += item.qtd * service.valorUnit;
      });
      accumulated += medValue;
      return {
        name: `MD ${index + 1}`,
        valor: medValue,
        acumulado: accumulated
      };
    });

    const chartHeight = 300;
    const chartWidth = 800;
    
    // Aumentada a margem esquerda (padding.left) de 80 para 130 para caber o "R$"
    const padding = { top: 50, right: 40, bottom: 40, left: 130 };
    const innerSidePadding = 40; // Espaço interno extra para as colunas não tocarem no eixo Y
    const effectiveWidth = chartWidth - padding.left - padding.right - (innerSidePadding * 2);

    const maxValY = globalStats.valorTotalContrato > 0 ? globalStats.valorTotalContrato * 1.1 : 100000;
    
    const getY = (val) => chartHeight - padding.bottom - ((val / maxValY) * (chartHeight - padding.top - padding.bottom));
    
    // Novo cálculo de X: Garante que a primeira coluna não sobreponha a linha de valores
    const getX = (index) => padding.left + innerSidePadding + (
      chartData.length > 1 
        ? index * (effectiveWidth / (chartData.length - 1)) 
        : effectiveWidth / 2
    );

    const contractLineY = getY(globalStats.valorTotalContrato);

    let areaPoints = '';
    if (chartData.length > 0) {
      areaPoints = `${getX(0)},${chartHeight - padding.bottom} `;
      chartData.forEach((d, i) => {
        areaPoints += `${getX(i)},${getY(d.acumulado)} `;
      });
      areaPoints += `${getX(chartData.length - 1)},${chartHeight - padding.bottom}`;
    }

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold text-slate-800">Relatório de Evolução da Obra</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-slate-800">
            <p className="text-sm font-medium text-slate-500 mb-1">Valor Total do Contrato</p>
            <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(globalStats.valorTotalContrato)}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-green-500">
            <p className="text-sm font-medium text-slate-500 mb-1">Valor Medido Global</p>
            <h3 className="text-2xl font-bold text-green-600">{formatCurrency(globalStats.valorTotalMedido)}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-orange-500">
            <p className="text-sm font-medium text-slate-500 mb-1">Saldo a Medir</p>
            <h3 className="text-2xl font-bold text-orange-600">{formatCurrency(globalStats.saldoTotal)}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-blue-500">
            <p className="text-sm font-medium text-slate-500 mb-1">% Geral Medido</p>
            <div className="flex items-end gap-2">
              <h3 className="text-2xl font-bold text-blue-600">{formatPercent(globalStats.percentMedido)}</h3>
              <TrendingUp className="w-5 h-5 text-blue-500 mb-1" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Avanço Físico-Financeiro (Medições)</h3>
          <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full min-w-[700px] h-auto">
              
              {/* Eixos Y: Réguas exatas de valores */}
              {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
                const y = chartHeight - padding.bottom - (ratio * (chartHeight - padding.top - padding.bottom));
                return (
                  <g key={`grid-${ratio}`}>
                    {/* Linha da grade */}
                    <line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y} stroke="#e2e8f0" strokeDasharray="4 4" />
                    {/* Texto com a margem esquerda ajustada e sem chance de cortar o R$ */}
                    <text x={padding.left - 15} y={y + 4} textAnchor="end" className="text-xs fill-slate-500 font-medium">
                      {formatCurrency(ratio * maxValY)}
                    </text>
                  </g>
                );
              })}

              {/* Teto do Contrato com Valor */}
              <line 
                x1={padding.left} y1={contractLineY} 
                x2={chartWidth - padding.right} y2={contractLineY} 
                stroke="#ef4444" strokeWidth="2" strokeDasharray="6 4" 
              />
              <text x={chartWidth - padding.right} y={contractLineY - 8} textAnchor="end" className="text-xs font-semibold fill-red-500">
                Total do Contrato: {formatCurrency(globalStats.valorTotalContrato)}
              </text>

              {/* Gráfico de Área (Sombreado do Acumulado) */}
              {chartData.length > 0 && (
                <>
                  <polygon points={areaPoints} fill="rgba(59, 130, 246, 0.1)" />
                  <polyline 
                    points={chartData.map((d, i) => `${getX(i)},${getY(d.acumulado)}`).join(' ')}
                    fill="none" stroke="#3b82f6" strokeWidth="3"
                  />
                  {chartData.map((d, i) => (
                    <circle key={`dot-${i}`} cx={getX(i)} cy={getY(d.acumulado)} r="4" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
                  ))}
                </>
              )}

              {/* Colunas da Medição do Período */}
              {chartData.map((d, i) => {
                const barHeight = (d.valor / maxValY) * (chartHeight - padding.top - padding.bottom);
                const barWidth = 30;
                return (
                  <g key={`bar-${i}`}>
                    <rect 
                      x={getX(i) - barWidth/2} 
                      y={getY(d.valor)} 
                      width={barWidth} 
                      height={barHeight} 
                      fill="#10b981" 
                      rx="4" ry="4"
                    />
                    <text x={getX(i)} y={chartHeight - padding.bottom + 20} textAnchor="middle" className="text-xs font-medium fill-slate-600">
                      {d.name}
                    </text>
                    {/* Texto fora da coluna para não poluir */}
                    <text x={getX(i)} y={getY(d.valor) - 8} textAnchor="middle" className="text-[10px] font-bold fill-emerald-700">
                      {formatCurrency(d.valor)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div><span className="text-sm text-slate-600">Medição Período</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div><span className="text-sm text-slate-600">Acumulado Total</span></div>
            <div className="flex items-center gap-2"><div className="w-8 h-[2px] border-b-2 border-red-500 border-dashed"></div><span className="text-sm text-slate-600">Limite de Contrato</span></div>
          </div>
        </div>
      </div>
    );
  };

  const renderServicos = () => {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">Escopo do Contrato (Serviços)</h2>
          <button 
            onClick={() => setIsServiceModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Novo Serviço
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-auto max-h-[60vh] relative">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10 shadow-sm">
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                  <th className="p-4 font-semibold bg-slate-50">Cód.</th>
                  <th className="p-4 font-semibold bg-slate-50">Etapa</th>
                  <th className="p-4 font-semibold bg-slate-50">Descrição do Serviço</th>
                  <th className="p-4 font-semibold text-center bg-slate-50">Unid.</th>
                  <th className="p-4 font-semibold text-right bg-slate-50">Qtd. Total</th>
                  <th className="p-4 font-semibold text-right bg-slate-50">Valor Unit.</th>
                  <th className="p-4 font-semibold text-right bg-slate-50">Total Item</th>
                  <th className="p-4 font-semibold text-center w-16 bg-slate-50">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {services.map(srv => (
                  <tr key={srv.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4 text-slate-500">#{srv.id.toString().padStart(3, '0')}</td>
                    <td className="p-4 font-medium text-slate-700"><span className="bg-slate-100 px-2 py-1 rounded-md text-xs">{srv.etapa}</span></td>
                    <td className="p-4 text-slate-800">{srv.descricao}</td>
                    <td className="p-4 text-center text-slate-500">{srv.unidade}</td>
                    <td className="p-4 text-right font-medium text-slate-700">{srv.qtdTotal.toLocaleString('pt-BR')}</td>
                    <td className="p-4 text-right text-slate-600">{formatCurrency(srv.valorUnit)}</td>
                    <td className="p-4 text-right font-bold text-slate-800">{formatCurrency(srv.qtdTotal * srv.valorUnit)}</td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => openEditServiceModal(srv)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Editar Serviço"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                <tr>
                  <td colSpan="6" className="p-4 text-right font-bold text-slate-700">VALOR TOTAL DO CONTRATO:</td>
                  <td className="p-4 text-right font-bold text-blue-700 text-lg">{formatCurrency(globalStats.valorTotalContrato)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderLançamentoMedicao = () => {
    const activeMed = measurements.find(m => m.id === activeMeasurementId);
    if (!activeMed) return null;

    const medicaoRows = services.map(service => {
      let qtdAcumuladaAnterior = 0;
      measurements.filter(m => m.id < activeMeasurementId).forEach(m => {
        const item = m.items.find(i => i.serviceId === service.id);
        if (item) qtdAcumuladaAnterior += item.qtd;
      });

      const currentItem = activeMed?.items.find(i => i.serviceId === service.id);
      const qtdAtual = currentItem ? currentItem.qtd : 0;
      const saldoAnteriorQtd = service.qtdTotal - qtdAcumuladaAnterior;
      
      const saldoAtualQtd = saldoAnteriorQtd - qtdAtual;
      const valorMedicaoAtual = qtdAtual * service.valorUnit;

      return {
        ...service, qtdAcumuladaAnterior, saldoAnteriorQtd, qtdAtual, valorMedicaoAtual, saldoAtualQtd
      };
    });

    const valorTotalDestaMedicao = medicaoRows.reduce((acc, row) => acc + row.valorMedicaoAtual, 0);

    return (
      <div id="area-medicao-pdf" className="space-y-6 animate-in fade-in duration-500 bg-slate-50">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4 print:hidden" data-html2canvas-ignore="true">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Planilha de Medição</h2>
            <p className="text-slate-500 mt-1">Selecione o período e informe as quantidades executadas.</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {measurements.map(med => (
              <button 
                key={med.id}
                onClick={() => setActiveMeasurementId(med.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all border ${
                  activeMeasurementId === med.id 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {med.name}
              </button>
            ))}
            <button 
              onClick={handleNewMeasurement}
              className="px-3 py-2 rounded-lg text-blue-600 border border-blue-200 hover:bg-blue-50 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-4 h-4" /> Nova
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-blue-50/50 p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-200">
            <div>
              <h3 className="text-blue-900 font-bold text-xl">{activeMed.name} <span className="text-sm font-normal text-blue-600 ml-2">({new Date(activeMed.date).toLocaleDateString('pt-BR')})</span></h3>
              <p className="text-sm text-blue-700 mt-1 flex items-center gap-2">
                Status: 
                {activeMed.status === 'fechada' ? 
                  <span className="flex items-center gap-1 text-emerald-600 font-medium"><CheckCircle2 className="w-4 h-4"/> Fechada</span> : 
                  <span className="flex items-center gap-1 text-orange-600 font-medium"><AlertCircle className="w-4 h-4"/> Em andamento</span>
                }
              </p>
            </div>
            
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="text-right flex-1 md:flex-none">
                <p className="text-blue-700 text-sm font-medium mb-1">Total a Pagar (Período)</p>
                <h2 className="text-3xl font-black text-blue-900">{formatCurrency(valorTotalDestaMedicao)}</h2>
              </div>
              
              <div className="hidden md:flex gap-2 print:hidden border-l border-blue-200 pl-6" data-html2canvas-ignore="true">
                <button onClick={() => { window.focus(); window.print(); }} className="p-2 bg-white text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-50 hover:text-blue-600 transition-colors" title="Imprimir/Visualizar">
                  <Printer className="w-5 h-5" />
                </button>
                <button onClick={handleDownloadPDF} className="p-2 bg-white text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-50 hover:text-red-600 transition-colors" title="Baixar PDF">
                  <div className="flex font-bold text-[10px] items-center gap-1 text-red-600">PDF</div>
                </button>
                <button onClick={exportExcelFormatted} className="p-2 bg-white text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-50 hover:text-emerald-600 transition-colors" title="Baixar Excel Formatado">
                  <div className="flex font-bold text-[10px] items-center gap-1 text-emerald-600"><Download className="w-4 h-4"/> XLS</div>
                </button>
                <button onClick={() => setDeleteModal({ isOpen: true, id: activeMed.id, password: '', error: '' })} className="p-2 bg-white text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-50 hover:text-red-600 transition-colors" title="Excluir Medição">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-auto max-h-[60vh] relative">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10 shadow-sm">
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 text-[11px] uppercase tracking-wider">
                  <th className="p-3 font-semibold w-[25%] bg-slate-100">Descrição do Serviço</th>
                  <th className="p-3 font-semibold text-center bg-slate-100">Unid.</th>
                  <th className="p-3 font-semibold text-right text-slate-400 bg-slate-100">Planejado</th>
                  <th className="p-3 font-semibold text-right text-orange-500 bg-slate-100">Saldo Ant.</th>
                  <th className="p-3 font-semibold text-center bg-blue-50 text-blue-800 border-l border-r border-blue-200">Qtd. a Medir</th>
                  <th className="p-3 font-semibold text-right bg-blue-50 text-blue-800">Total (R$)</th>
                  <th className="p-3 font-semibold text-right text-emerald-600 bg-slate-100">Saldo Novo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {medicaoRows.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50 group">
                    <td className="p-3 text-slate-800 font-medium min-w-[250px]" title={row.descricao}>
                      {row.descricao}
                    </td>
                    <td className="p-3 text-center text-slate-500">{row.unidade}</td>
                    <td className="p-3 text-right text-slate-400">{row.qtdTotal.toLocaleString('pt-BR')}</td>
                    <td className="p-3 text-right text-orange-600 font-medium print:bg-orange-50">{row.saldoAnteriorQtd.toLocaleString('pt-BR')}</td>
                    
                    <td className="p-2 bg-blue-50 border-l border-r border-blue-100 print:bg-blue-50">
                      <div className="flex justify-center">
                        <input 
                          type="number" 
                          value={row.qtdAtual || ''}
                          disabled={activeMed.status === 'fechada'}
                          onChange={(e) => {
                             const newVal = parseFloat(e.target.value) || 0;
                             setMeasurements(prev => prev.map(m => {
                               if(m.id !== activeMeasurementId) return m;
                               const newItems = [...m.items];
                               const itemIdx = newItems.findIndex(i => i.serviceId === row.id);
                               if(itemIdx > -1) newItems[itemIdx] = { ...newItems[itemIdx], qtd: newVal };
                               else newItems.push({ serviceId: row.id, qtd: newVal });
                               return { ...m, items: newItems };
                             }));
                          }}
                          className="w-24 text-center font-bold text-blue-900 border border-blue-300 rounded-md py-1.5 px-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none print:hidden print:border-none print:bg-transparent print:p-0 disabled:opacity-50 disabled:bg-slate-200 disabled:cursor-not-allowed transition-all"
                          placeholder="0"
                        />
                        <span className="hidden print:block font-bold text-blue-900 text-center">{row.qtdAtual || 0}</span>
                      </div>
                    </td>
                    
                    <td className="p-3 text-right font-bold text-blue-900 bg-blue-50/50 print:bg-blue-100">{formatCurrency(row.valorMedicaoAtual)}</td>
                    <td className={`p-3 text-right font-bold ${row.saldoAtualQtd < 0 ? 'text-red-600 print:bg-red-50' : 'text-emerald-600 print:bg-emerald-50'}`}>{row.saldoAtualQtd.toLocaleString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end print:hidden" data-html2canvas-ignore="true">
             {activeMed.status === 'aberta' ? (
               <button 
                 onClick={() => handleToggleStatus('fechada')}
                 className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm shadow-emerald-600/20"
               >
                 <CheckCircle2 className="w-4 h-4" /> Salvar e Fechar Lançamento
               </button>
             ) : (
               <button 
                 onClick={() => handleToggleStatus('aberta')}
                 className="bg-orange-100 hover:bg-orange-200 text-orange-700 border border-orange-200 px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
               >
                 <Unlock className="w-4 h-4" /> Reabrir Lançamento
               </button>
             )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @media print {
          @page { size: landscape; margin: 10mm; }
          body { background: white; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          main { padding: 0 !important; width: 100% !important; max-width: 100% !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
        
        <aside className={`bg-slate-900 text-slate-300 flex flex-col shadow-xl z-20 hidden md:flex transition-all duration-300 relative ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute -right-3 top-6 bg-slate-800 hover:bg-slate-700 text-white p-1.5 rounded-full border border-slate-700 z-30 transition-transform"
            title="Recolher Menu"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
          </button>

          <div className={`p-6 border-b border-slate-800 flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3'}`}>
            <Ruler className="w-8 h-8 text-blue-500 shrink-0" />
            {!isSidebarCollapsed && (
              <div className="animate-in fade-in">
                <h1 className="text-xl font-bold tracking-tight text-white">MediçãoPro</h1>
                <p className="text-xs text-slate-500">Gestão de Empreiteiros</p>
              </div>
            )}
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <LayoutDashboard className="w-5 h-5 shrink-0" /> 
              {!isSidebarCollapsed && <span className="truncate">Dashboard</span>}
            </button>
            
            <button 
              onClick={() => setActiveTab('servicos')}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl transition-all ${activeTab === 'servicos' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <ClipboardList className="w-5 h-5 shrink-0" /> 
              {!isSidebarCollapsed && <span className="truncate">Escopo / Serviços</span>}
            </button>

            <button 
              onClick={() => setActiveTab('medicoes')}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl transition-all ${activeTab === 'medicoes' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <Ruler className="w-5 h-5 shrink-0" /> 
              {!isSidebarCollapsed && <span className="truncate">Lançar Medição</span>}
            </button>
          </nav>
        </aside>

        <main className="flex-1 flex flex-col mx-auto w-full overflow-x-hidden">
          
          <header className="bg-white p-6 border-b border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 print:hidden group relative">
            <button 
              onClick={() => { setTempProjectInfo(projectInfo); setIsHeaderModalOpen(true); }}
              className="absolute right-4 top-4 bg-slate-100 text-slate-500 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-md opacity-0 group-hover:opacity-100 transition-all border border-slate-200 shadow-sm z-10"
              title="Editar Dados da Obra"
            >
              <Edit className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Building2 className="w-4 h-4" />
                <span className="text-sm font-semibold tracking-wider text-blue-600 uppercase">Obra: {projectInfo.obra}</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <HardHat className="w-6 h-6 text-orange-500" /> Empreiteiro: {projectInfo.contratada}
              </h2>
            </div>
            <div className="flex gap-6 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
               <div>
                 <p className="text-slate-400 text-xs uppercase mb-0.5">Contratante</p>
                 <p className="font-semibold">{projectInfo.contratante}</p>
               </div>
               <div>
                 <p className="text-slate-400 text-xs uppercase mb-0.5">Responsável</p>
                 <p className="font-semibold">{projectInfo.responsavel}</p>
               </div>
               <div className="hidden sm:block">
                 <p className="text-slate-400 text-xs uppercase mb-0.5">Local</p>
                 <p className="font-semibold flex items-center gap-1"><MapPin className="w-3 h-3"/> {projectInfo.endereco}</p>
               </div>
            </div>
          </header>

          <div className="flex-1 p-6 md:p-8 overflow-auto">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'servicos' && renderServicos()}
            {activeTab === 'medicoes' && renderLançamentoMedicao()}
          </div>

        </main>
      </div>

      {/* MODAL DE SEGURANÇA PARA EXCLUSÃO */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Excluir Medição?</h3>
            <p className="text-slate-500 mb-6 text-sm">
              Esta ação é irreversível e removerá as quantidades medidas deste período. Insira a senha administrativa para confirmar.
            </p>
            
            <div className="space-y-4">
              <div>
                <input 
                  type="password" 
                  value={deleteModal.password}
                  onChange={(e) => setDeleteModal({...deleteModal, password: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-shadow"
                  placeholder="Senha de Autorização"
                />
                {deleteModal.error && <p className="text-red-500 text-sm mt-1">{deleteModal.error}</p>}
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button 
                  onClick={() => setDeleteModal({ isOpen: false, id: null, password: '', error: '' })}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={executeDeleteMeasurement}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Confirmar Exclusão
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EDITAR CABEÇALHO */}
      {isHeaderModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 border border-slate-200 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Edit className="w-5 h-5 text-blue-500" /> Editar Dados do Contrato
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Obra</label>
                <input type="text" value={tempProjectInfo.obra} onChange={e => setTempProjectInfo({...tempProjectInfo, obra: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Empreiteiro (Contratada)</label>
                <input type="text" value={tempProjectInfo.contratada} onChange={e => setTempProjectInfo({...tempProjectInfo, contratada: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Contratante</label>
                <input type="text" value={tempProjectInfo.contratante} onChange={e => setTempProjectInfo({...tempProjectInfo, contratante: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Responsável</label>
                <input type="text" value={tempProjectInfo.responsavel} onChange={e => setTempProjectInfo({...tempProjectInfo, responsavel: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Local / Endereço</label>
                <input type="text" value={tempProjectInfo.endereco} onChange={e => setTempProjectInfo({...tempProjectInfo, endereco: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsHeaderModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancelar</button>
              <button onClick={handleSaveProjectInfo} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">Salvar Alterações</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE NOVO SERVIÇO */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 border border-slate-200 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-500" /> Adicionar Novo Serviço
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Etapa (Ex: MOVIMENTO DE TERRA)</label>
                <input type="text" value={newService.etapa} onChange={e => setNewService({...newService, etapa: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nome da Etapa" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Descrição do Serviço</label>
                <input type="text" value={newService.descricao} onChange={e => setNewService({...newService, descricao: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: ESCAVAÇÃO DE VALA" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Unidade</label>
                <input type="text" value={newService.unidade} onChange={e => setNewService({...newService, unidade: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: M³, M², UNID." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Quantidade Total Planejada</label>
                <input type="number" value={newService.qtdTotal || ''} onChange={e => setNewService({...newService, qtdTotal: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Valor Unitário (R$)</label>
                <input type="number" value={newService.valorUnit || ''} onChange={e => setNewService({...newService, valorUnit: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0.00" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsServiceModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancelar</button>
              <button 
                onClick={handleAddService} 
                disabled={!newService.descricao || !newService.etapa}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors"
              >
                Cadastrar Serviço
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EDITAR SERVIÇO */}
      {isEditServiceModalOpen && editingService && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 border border-slate-200 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Pencil className="w-5 h-5 text-blue-500" /> Editar Serviço #{editingService.id.toString().padStart(3, '0')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Etapa</label>
                <input type="text" value={editingService.etapa} onChange={e => setEditingService({...editingService, etapa: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Descrição do Serviço</label>
                <input type="text" value={editingService.descricao} onChange={e => setEditingService({...editingService, descricao: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Unidade</label>
                <input type="text" value={editingService.unidade} onChange={e => setEditingService({...editingService, unidade: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Quantidade Total Planejada</label>
                <input type="number" value={editingService.qtdTotal} onChange={e => setEditingService({...editingService, qtdTotal: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Valor Unitário (R$)</label>
                <input type="number" value={editingService.valorUnit} onChange={e => setEditingService({...editingService, valorUnit: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => {setIsEditServiceModalOpen(false); setEditingService(null);}} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancelar</button>
              <button 
                onClick={handleUpdateService} 
                disabled={!editingService.descricao || !editingService.etapa}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}