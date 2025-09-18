// Тестовый скрипт для проверки логики поиска пользователя по телефону
const testCases = [
  {
    input: "+7(123)-456-78-90",
    expected: "phone search",
    description: "Полный формат телефона"
  },
  {
    input: "testuser",
    expected: "login search", 
    description: "Обычный логин"
  },
  {
    input: "+7123",
    expected: "phone search",
    description: "Частичный телефон с +"
  },
  {
    input: "7(123)",
    expected: "phone search", 
    description: "Телефон со скобками"
  },
  {
    input: "admin",
    expected: "login search",
    description: "Админский логин"
  }
];

function simulateUserSearch(loginOrPhone) {
  // Копия логики из findUserByLoginOrPhone
  if (loginOrPhone.includes('+') || loginOrPhone.includes('(') || loginOrPhone.includes('-')) {
    return 'phone search';
  }
  return 'login search';
}

console.log('Тестирование логики поиска пользователей:\n');

testCases.forEach((testCase, index) => {
  const result = simulateUserSearch(testCase.input);
  const status = result === testCase.expected ? '✅ PASS' : '❌ FAIL';
  
  console.log(`${index + 1}. ${testCase.description}`);
  console.log(`   Вход: "${testCase.input}"`);
  console.log(`   Ожидается: ${testCase.expected}`);
  console.log(`   Результат: ${result} ${status}\n`);
});
