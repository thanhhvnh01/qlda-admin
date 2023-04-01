export const STORAGE_KEYS = {
  userData: 'userData',
  token: 'token',
  deviceToken: 'deviceToken',
  printData: 'printData',
};

const Storage = {};

Storage.setItem = (key, value) => {
  if (!STORAGE_KEYS[key]) {
    throw new Error('Key not exists');
  }
  const saveValue = {
    value,
  };
  return localStorage.setItem(key, JSON.stringify(saveValue));
};

Storage.getItem = (key, defaultValue = null) => {
  if (!STORAGE_KEYS[key]) {
    throw new Error('Key not exists');
  }
  let savedValue = localStorage.getItem(key);
  if (savedValue) {
    savedValue = JSON.parse(savedValue);
    return savedValue.value || defaultValue;
  }
  return defaultValue;
};

Storage.clear = (key) => {
  localStorage.removeItem(key);
};

Storage.clearAll = () => {
  const keys = Object.keys(STORAGE_KEYS);
  for (let i = 0; i < keys.length; i++) {
    localStorage.removeItem(keys[i]);
  }
};

export { Storage };
