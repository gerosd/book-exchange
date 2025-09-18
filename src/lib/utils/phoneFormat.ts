/**
 * Утилита для форматирования телефонных номеров в российском формате +7(XXX)-XXX-XX-XX
 */

/**
 * Форматирует телефонный номер для ввода (интерактивный режим)
 * @param input - введенное значение
 * @returns отформатированный номер
 */
export function formatPhoneInput(input: string): string {
    // Удаляем все символы кроме цифр
    // Если номер начинается с 8, заменяем на 7
    let cleanNumbers = input.replace(/\D/g, '');
    if (cleanNumbers.startsWith('8')) {
        cleanNumbers = '7' + cleanNumbers.slice(1);
    }

    // Если номер не начинается с 7, добавляем 7
    if (!cleanNumbers.startsWith('7')) {
        cleanNumbers = '7' + cleanNumbers;
    }

    // Ограничиваем длину до 11 цифр (7 + 10)
    cleanNumbers = cleanNumbers.slice(0, 11);

    // Форматируем в +7(XXX)-XXX-XX-XX
    if (cleanNumbers.length === 0) return '';
    if (cleanNumbers.length <= 1) return '+7';
    if (cleanNumbers.length <= 4) return `+7(${cleanNumbers.slice(1)}`;
    if (cleanNumbers.length <= 7) return `+7(${cleanNumbers.slice(1, 4)})-${cleanNumbers.slice(4)}`;
    if (cleanNumbers.length <= 9) return `+7(${cleanNumbers.slice(1, 4)})-${cleanNumbers.slice(4, 7)}-${cleanNumbers.slice(7)}`;
    return `+7(${cleanNumbers.slice(1, 4)})-${cleanNumbers.slice(4, 7)}-${cleanNumbers.slice(7, 9)}-${cleanNumbers.slice(9)}`;
}

/**
 * Форматирует телефонный номер для отображения (статичный режим)
 * @param phoneNumber - номер телефона
 * @returns отформатированный номер
 */
export function formatPhoneDisplay(phoneNumber: string): string {
    // Если номер уже в правильном формате, возвращаем как есть
    if (/^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$/.test(phoneNumber)) {
        return phoneNumber;
    }

    // Используем ту же логику, что и для ввода
    const formatted = formatPhoneInput(phoneNumber);

    // Если результат пустой, возвращаем исходный номер
    return formatted || phoneNumber;
}

/**
 * Проверяет, является ли номер телефона валидным
 * @param phone - номер телефона
 * @returns true, если номер валидный
 */
export function isValidPhoneNumber(phone: string): boolean {
    return /^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$/.test(phone);
}
