// import React, { useState } from 'react';
// import axios from 'axios';

// const Summarizer = () => {
//   const [text, setText] = useState('');
//   const [summary, setSummary] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSummarize = async () => {
//     if (!text.trim()) {
//       setError('Пожалуйста, введите текст для конспектирования');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const response = await axios.post('http://localhost:8080/api/summaries/summarize', {
//         text: text
//       });

//       setSummary(response.data.summary);
//     } catch (error) {
//       setError(error.response?.data || 'Ошибка при создании конспекта');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     setLoading(true);
//     setError('');

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await axios.post('http://localhost:5000/api/summarize/file', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       setSummary(response.data.summary);
//     } catch (error) {
//       setError(error.response?.data?.error || 'Ошибка при обработке файла');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = () => {
//     const element = document.createElement('a');
//     const file = new Blob([summary], { type: 'text/plain' });
//     element.href = URL.createObjectURL(file);
//     element.download = 'конспект.txt';
//     document.body.appendChild(element);
//     element.click();
//     document.body.removeChild(element);
//   };

//   const handleClear = () => {
//     setText('');
//     setSummary('');
//     setError('');
//   };

//   return (
//     <div className="summarizer">
//       <h1>Создание AI-конспекта</h1>
      
//       {error && <div className="error">{error}</div>}
      
//       <div className="file-upload">
//         <input
//           type="file"
//           id="file-upload"
//           onChange={handleFileUpload}
//           accept=".pdf,.docx,.doc,.txt"
//           style={{ display: 'none' }}
//         />
//         <label htmlFor="file-upload" className="upload-btn">
//           📁 Загрузить файл (PDF, DOCX, TXT)
//         </label>
//         <span>или введите текст ниже:</span>
//       </div>

//       <textarea
//         className="text-input"
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         placeholder="Введите текст для конспектирования или загрузите файл..."
//         disabled={loading}
//       />

//       <div className="actions">
//         <button 
//           onClick={handleSummarize} 
//           className="btn btn-primary"
//           disabled={loading || !text.trim()}
//         >
//           {loading ? 'Создание конспекта...' : 'Создать конспект'}
//         </button>
        
//         <button 
//           onClick={handleClear} 
//           className="btn btn-secondary"
//           disabled={loading}
//         >
//           Очистить
//         </button>
//       </div>

//       {summary && (
//         <div className="summary-result">
//           <h3>Ваш конспект:</h3>
//           <div className="summary-text">{summary}</div>
          
//           <button 
//             onClick={handleDownload} 
//             className="download-btn"
//           >
//             📥 Скачать конспект
//           </button>
//         </div>
//       )}
      
//       {loading && (
//         <div className="loading">
//           <p>AI обрабатывает ваш запрос... Это может занять несколько секунд.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Summarizer;




///////////////////////////////////////////////////////////



// import React, { useState } from 'react';
// import axios from 'axios';
// import { useAuth } from '../contexts/AuthContext';

// const Summarizer = () => {
//   const { user } = useAuth();
//   const [text, setText] = useState('');
//   const [title, setTitle] = useState('');
//   const [summary, setSummary] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleSummarize = async () => {
//     if (!text.trim()) {
//       setError('Пожалуйста, введите текст для конспектирования');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       console.log('Sending summarization request...');
//       const response = await axios.post('http://localhost:8081/api/summaries/summarize', {
//         text: text,
//         title: title || `Конспект от ${new Date().toLocaleString()}`
//       });

//       console.log('Summarization response:', response.data);
      
//       setSummary(response.data.summary);
//       setSuccess(response.data.message || 'Конспект успешно создан!');
      
//       // Очищаем поле ввода после успешного создания
//       setText('');
//       setTitle('');
      
//     } catch (error) {
//       console.error('Summarization error:', error);
//       setError(error.response?.data || 'Ошибка при создании конспекта');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTestSave = async () => {
//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       console.log('Sending test save request...');
//       const response = await axios.post('http://localhost:8081/api/summaries/test-save', {
//         text: 'Это тестовый текст для проверки сохранения в базу данных.',
//         title: 'Тестовый конспект'
//       });

//       console.log('Test save response:', response.data);
//       setSuccess(response.data.message || 'Тестовый конспект сохранен! Проверьте историю.');
      
//     } catch (error) {
//       console.error('Test save error:', error);
//       setError(error.response?.data || 'Ошибка при тестовом сохранении');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     setLoading(true);
//     setError('');
//     setSuccess('');

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await axios.post('http://localhost:5000/api/summarize/file', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       setSummary(response.data.summary);
//       setTitle(`Конспект файла: ${file.name}`);
//       setSuccess('Файл успешно обработан!');
//     } catch (error) {
//       console.error('File upload error:', error);
//       setError(error.response?.data?.error || 'Ошибка при обработке файла');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = () => {
//     const element = document.createElement('a');
//     const file = new Blob([summary], { type: 'text/plain; charset=utf-8' });
//     element.href = URL.createObjectURL(file);
//     element.download = 'конспект.txt';
//     document.body.appendChild(element);
//     element.click();
//     document.body.removeChild(element);
//   };

//   const handleClear = () => {
//     setText('');
//     setTitle('');
//     setSummary('');
//     setError('');
//     setSuccess('');
//   };

//   return (
//     <div className="summarizer">
//       <h1>Создание AI-конспекта</h1>
      
//       <div className="debug-info" style={{background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem'}}>
//         <strong>Отладка:</strong> Пользователь: {user?.email} | Токен: {user?.token ? 'есть' : 'нет'}
//       </div>

//       {error && <div className="error">{error}</div>}
//       {success && <div className="success">{success}</div>}
      
//       <div className="test-actions" style={{marginBottom: '1rem'}}>
//         <button 
//           onClick={handleTestSave}
//           className="btn btn-secondary"
//           disabled={loading}
//         >
//           Тест сохранения
//         </button>
//       </div>

//       <div className="file-upload">
//         <input
//           type="file"
//           id="file-upload"
//           onChange={handleFileUpload}
//           accept=".pdf,.docx,.doc,.txt"
//           style={{ display: 'none' }}
//           disabled={loading}
//         />
//         <label htmlFor="file-upload" className={`upload-btn ${loading ? 'disabled' : ''}`}>
//           📁 Загрузить файл (PDF, DOCX, TXT)
//         </label>
//         <span style={{ marginLeft: '1rem' }}>или введите текст ниже:</span>
//       </div>

//       <div className="form-group">
//         <label>Название конспекта (необязательно):</label>
//         <input
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="Введите название для конспекта..."
//           disabled={loading}
//           className="text-input"
//           style={{padding: '0.75rem', marginBottom: '1rem'}}
//         />
//       </div>

//       <textarea
//         className="text-input"
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         placeholder="Введите текст для конспектирования или загрузите файл..."
//         disabled={loading}
//       />

//       <div className="actions">
//         <button 
//           onClick={handleSummarize} 
//           className="btn btn-primary"
//           disabled={loading || !text.trim()}
//         >
//           {loading ? 'Создание конспекта...' : 'Создать конспект'}
//         </button>
        
//         <button 
//           onClick={handleClear} 
//           className="btn btn-secondary"
//           disabled={loading}
//         >
//           Очистить
//         </button>
//       </div>

//       {summary && (
//         <div className="summary-result">
//           <h3>Ваш конспект:</h3>
//           <div className="summary-text">{summary}</div>
          
//           <button 
//             onClick={handleDownload} 
//             className="download-btn"
//           >
//             📥 Скачать конспект
//           </button>
//         </div>
//       )}
      
//       {loading && (
//         <div className="loading">
//           <p>AI обрабатывает ваш запрос... Это может занять несколько секунд.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Summarizer;



///////////////////////////



import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Summarizer = () => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError('Пожалуйста, введите текст для конспектирования');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Sending summarization request...');
      const response = await axios.post('http://localhost:8081/api/summaries/summarize', {
        text: text,
        title: title || `Конспект от ${new Date().toLocaleString()}`
      });

      console.log('Summarization response:', response.data);
      
      setSummary(response.data.summary);
      setSuccess(response.data.message || 'Конспект успешно создан!');
      
      // Очищаем поле ввода после успешного создания
      setText('');
      setTitle('');
      
    } catch (error) {
      console.error('Summarization error:', error);
      setError(error.response?.data || 'Ошибка при создании конспекта');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Сначала отправляем файл в Python сервис для обработки
      console.log('Uploading file to Python service...');
      const pythonResponse = await axios.post('http://localhost:5000/api/summarize/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Python service response:', pythonResponse.data);

      const { summary: summaryText, original_text, original_length, filename } = pythonResponse.data;
      
      // 2. Теперь сохраняем результат в базу через Java бэкенд
      console.log('Saving file summary to database...');
      const saveResponse = await axios.post('http://localhost:8081/api/summaries/summarize-file', {
        originalText: original_text,
        summaryText: summaryText,
        title: title || `Конспект файла: ${filename}`,
        documentType: getFileType(file.name),
        originalFileName: file.name,
        originalLength: original_length,
        summaryLength: summaryText.length
      });

      console.log('Save to database response:', saveResponse.data);

      setSummary(summaryText);
      setSuccess('Файл успешно обработан и сохранен в историю!');
      
    } catch (error) {
      console.error('File upload error:', error);
      setError(error.response?.data?.error || error.response?.data || 'Ошибка при обработке файла');
    } finally {
      setLoading(false);
      // Сбрасываем значение input чтобы можно было загрузить тот же файл снова
      event.target.value = '';
    }
  };

  const getFileType = (filename) => {
    const ext = filename.toLowerCase().split('.').pop();
    switch (ext) {
      case 'pdf': return 'PDF';
      case 'docx': return 'DOCX';
      case 'doc': return 'DOC';
      case 'txt': return 'TXT';
      default: return 'FILE';
    }
  };

  const handleTestSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Sending test save request...');
      const response = await axios.post('http://localhost:8081/api/summaries/test-save', {
        text: 'Это тестовый текст для проверки сохранения в базу данных.',
        title: 'Тестовый конспект'
      });

      console.log('Test save response:', response.data);
      setSuccess(response.data.message || 'Тестовый конспект сохранен! Проверьте историю.');
      
    } catch (error) {
      console.error('Test save error:', error);
      setError(error.response?.data || 'Ошибка при тестовом сохранении');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([summary], { type: 'text/plain; charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = 'конспект.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleClear = () => {
    setText('');
    setTitle('');
    setSummary('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="summarizer">
      <h1>Создание AI-конспекта</h1>
      
      <div className="debug-info" style={{background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem'}}>
        <strong>Отладка:</strong> Пользователь: {user?.email} | Токен: {user?.token ? 'есть' : 'нет'}
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      <div className="test-actions" style={{marginBottom: '1rem'}}>
        <button 
          onClick={handleTestSave}
          className="btn btn-secondary"
          disabled={loading}
        >
          Тест сохранения
        </button>
      </div>

      <div className="file-upload">
        <input
          type="file"
          id="file-upload"
          onChange={handleFileUpload}
          accept=".pdf,.docx,.doc,.txt"
          style={{ display: 'none' }}
          disabled={loading}
        />
        <label htmlFor="file-upload" className={`upload-btn ${loading ? 'disabled' : ''}`}>
          📁 Загрузить файл (PDF, DOCX, TXT)
        </label>
        <span style={{ marginLeft: '1rem' }}>или введите текст ниже:</span>
      </div>

      <div className="form-group">
        <label>Название конспекта (необязательно):</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите название для конспекта..."
          disabled={loading}
          className="text-input"
          style={{padding: '0.75rem', marginBottom: '1rem'}}
        />
      </div>

      <textarea
        className="text-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Введите текст для конспектирования или загрузите файл..."
        disabled={loading}
        rows="8"
      />

      <div className="actions">
        <button 
          onClick={handleSummarize} 
          className="btn btn-primary"
          disabled={loading || !text.trim()}
        >
          {loading ? 'Создание конспекта...' : 'Создать конспект'}
        </button>
        
        <button 
          onClick={handleClear} 
          className="btn btn-secondary"
          disabled={loading}
        >
          Очистить
        </button>
      </div>

      {summary && (
        <div className="summary-result">
          <h3>Ваш конспект:</h3>
          <div className="summary-text">{summary}</div>
          
          <button 
            onClick={handleDownload} 
            className="download-btn"
          >
            📥 Скачать конспект
          </button>
        </div>
      )}
      
      {loading && (
        <div className="loading">
          <p>AI обрабатывает ваш запрос... Это может занять несколько секунд.</p>
        </div>
      )}
    </div>
  );
};

export default Summarizer;