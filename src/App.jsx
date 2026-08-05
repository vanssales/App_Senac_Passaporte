import { useState, useEffect } from 'react';

const mockOficinas = [
  { id: 1, nome: 'Moqueca de Peixe: A Culinária Angolana no Nordeste Brasileiro', categoria: 'Gastronomia e Alimentação', periodo: 'Tarde', inicio: '12:30', fim: '13:00', local: 'Laboratório 15' },
  { id: 2, nome: 'Introdução ao React e Vite', categoria: 'Tecnologia da Informação', periodo: 'Manhã', inicio: '09:00', fim: '11:00', local: 'Laboratório 3' },
  { id: 3, nome: 'Marketing Digital para Iniciantes', categoria: 'Comunicação e Marketing', periodo: 'Tarde', inicio: '14:00', fim: '15:30', local: 'Sala 12' },
  { id: 4, nome: 'Design Thinking na Prática', categoria: 'Design, Artes e Arquitetura', periodo: 'Noite', inicio: '19:00', fim: '20:30', local: 'Auditório Principal' },
  { id: 5, nome: 'Cuidados Básicos com a Pele', categoria: 'Beleza e Estética', periodo: 'Manhã', inicio: '10:00', fim: '11:30', local: 'Laboratório 8' }
];

const CATEGORIAS = ['Todas', 'Gastronomia e Alimentação', 'Tecnologia da Informação', 'Comunicação e Marketing', 'Design, Artes e Arquitetura', 'Beleza e Estética'];
const PERIODOS = ['Todos', 'Manhã', 'Tarde', 'Noite'];

function App() {
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [isFirstTime, setIsFirstTime] = useState('sim');
  const [error, setError] = useState('');

  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [filtroPeriodo, setFiltroPeriodo] = useState('Todos');

  // Verifica localStorage no carregamento
  useEffect(() => {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      try {
        setUserData(JSON.parse(savedData));
      } catch (err) {
        console.error('Erro ao ler userData', err);
      }
    }
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setError('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const getPeriodFromHour = () => {
    const hour = new Date().getHours();
    if (hour >= 8 && hour < 12) return 'Manhã';
    if (hour >= 12 && hour < 18) return 'Tarde';
    return 'Noite';
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Por favor, informe seu nome completo.');
      return;
    }

    const newUser = {
      fullName: fullName.trim(),
      isFirstTime: isFirstTime === 'sim',
      registeredAt: new Date().toISOString(),
      period: getPeriodFromHour(),
    };

    localStorage.setItem('userData', JSON.stringify(newUser));
    setUserData(newUser);
    setIsModalOpen(false);
  };

  // Se tem dados, vai para o cronograma
  if (userData) {
    const oficinasFiltradas = mockOficinas.filter(oficina => {
      const matchCategoria = filtroCategoria === 'Todas' || oficina.categoria === filtroCategoria;
      const matchPeriodo = filtroPeriodo === 'Todos' || oficina.periodo === filtroPeriodo;
      return matchCategoria && matchPeriodo;
    });

    return (
      <div className="app-container" style={{ alignItems: 'flex-start' }}>
        <div className="cronograma-container">
          <header className="cronograma-header">
            <h1>Cronograma</h1>
            <p className="cronograma-user">Olá, {userData.fullName}</p>
          </header>

          <div className="filtros-box">
            <select 
              className="form-input" 
              value={filtroPeriodo} 
              onChange={(e) => setFiltroPeriodo(e.target.value)}
            >
              {PERIODOS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            
            <select 
              className="form-input" 
              value={filtroCategoria} 
              onChange={(e) => setFiltroCategoria(e.target.value)}
            >
              {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="oficinas-list">
            {oficinasFiltradas.length > 0 ? (
              oficinasFiltradas.map(oficina => (
                <div key={oficina.id} className="oficina-card">
                  <span className="badge">{oficina.categoria}</span>
                  <h3 className="oficina-title">{oficina.nome}</h3>
                  <div className="oficina-meta">
                    <span>🕒 {oficina.inicio} - {oficina.fim} ({oficina.periodo})</span>
                    <span>📍 {oficina.local}</span>
                  </div>
                  <button className="btn btn-sm">Ver detalhes</button>
                </div>
              ))
            ) : (
              <p className="empty-state">Nenhuma oficina encontrada com os filtros selecionados.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Senão, tela inicial
  return (
    <div className="app-container">
      <div className="welcome-box">
        <h1 className="welcome-title">Bem-vindo ao Casa Aberta</h1>
        <p className="welcome-subtitle">
          Faça seu passaporte e descubra as melhores oficinas do evento de hoje no Senac.
        </p>
        <button className="btn" onClick={handleOpenModal}>
          Ver oficinas
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Quase lá!</h2>
            <p className="modal-subtitle">Para ver as oficinas, crie seu passaporte.</p>

            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label className="form-label">Nome Completo</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: João da Silva"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                {error && <span className="text-error">{error}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">É sua primeira vez no Senac?</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="firstTime"
                      value="sim"
                      checked={isFirstTime === 'sim'}
                      onChange={(e) => setIsFirstTime(e.target.value)}
                    />
                    Sim
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="firstTime"
                      value="nao"
                      checked={isFirstTime === 'nao'}
                      onChange={(e) => setIsFirstTime(e.target.value)}
                    />
                    Não
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn">
                  Criar passaporte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
