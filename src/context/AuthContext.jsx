import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

function getUsers() {
  return JSON.parse(localStorage.getItem('nvape_users') || '[]');
}
function saveUsers(users) {
  localStorage.setItem('nvape_users', JSON.stringify(users));
}
function getOrders() {
  return JSON.parse(localStorage.getItem('nvape_orders') || '[]');
}
export function saveOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem('nvape_orders', JSON.stringify(orders));
}
export function getOrdersByUser(email) {
  return getOrders().filter(o => o.email === email);
}
export function getOrderByRef(ref) {
  return getOrders().find(o => o.ref === ref) || null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nvape_user') || 'null'); } catch { return null; }
  });

  const register = (name, email, password) => {
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { error: 'An account with this email already exists.' };
    }
    const newUser = { id: Date.now(), name, email: email.toLowerCase(), password, createdAt: new Date().toISOString() };
    saveUsers([...users, newUser]);
    const { password: _, ...safe } = newUser;
    setUser(safe);
    localStorage.setItem('nvape_user', JSON.stringify(safe));
    return { success: true };
  };

  const login = (email, password) => {
    const users = getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) return { error: 'Incorrect email or password.' };
    const { password: _, ...safe } = found;
    setUser(safe);
    localStorage.setItem('nvape_user', JSON.stringify(safe));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nvape_user');
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
