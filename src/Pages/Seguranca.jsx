import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function Seguranca() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'A senha deve ter no mínimo 6 caracteres.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setMessage({ type: 'error', text: `Erro ao atualizar senha: ${error.message}` });
    } else {
      setMessage({ type: 'success', text: 'Senha atualizada com sucesso!' });
      setNewPassword('');
      setConfirmPassword('');
    }
    setLoading(false);
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const { error } = await supabase.auth.updateUser({ email: newEmail });

    if (error) {
      setMessage({ type: 'error', text: `Erro ao atualizar e-mail: ${error.message}` });
    } else {
      setMessage({ type: 'success', text: 'Verifique seu novo e-mail para confirmar a alteração.' });
      setNewEmail('');
    }
    setLoading(false);
  };

  return (
    <div className="conta-section">
      <h2>Segurança da Conta</h2>

      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

      <div className="card-info">
        <h3>Alterar Senha</h3>
        <form onSubmit={handleUpdatePassword}>
          <div className="form-group">
            <label htmlFor="new-password">Nova Senha</label>
            <input type="password" id="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirmar Nova Senha</label>
            <input type="password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Atualizando...' : 'Atualizar Senha'}
          </button>
        </form>
      </div>

      <div className="card-info">
        <h3>Alterar E-mail</h3>
        <form onSubmit={handleUpdateEmail}>
          <div className="form-group">
            <label htmlFor="new-email">Novo E-mail</label>
            <input type="email" id="new-email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Atualizando...' : 'Atualizar E-mail'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Seguranca;