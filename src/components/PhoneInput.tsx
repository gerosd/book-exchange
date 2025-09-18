'use client';

import {useEffect, useState} from 'react';
import {formatPhoneInput} from '@/lib/utils/phoneFormat';

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    required?: boolean;
    id?: string;
    name?: string;
}

export default function PhoneInput({
                                       value,
                                       onChange,
                                       placeholder = "+7(XXX)-XXX-XX-XX",
                                       className = "",
                                       required = false,
                                       id,
                                       name
                                   }: PhoneInputProps) {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        setDisplayValue(value);
    }, [value]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const formatted = formatPhoneInput(input);

        setDisplayValue(formatted);
        onChange(formatted);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Разрешаем: Backspace, Delete, Tab, Escape, Enter, стрелки
        if ([8, 9, 27, 13, 46, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 || (e.keyCode === 65 && e.ctrlKey) || (e.keyCode === 67 && e.ctrlKey) || (e.keyCode === 86 && e.ctrlKey) || (e.keyCode === 88 && e.ctrlKey)) {
            return;
        }

        // Разрешаем только цифры
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    };

    return (
        <input
            type="tel"
            id={id}
            name={name}
            value={displayValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            required={required}
            className={className}
            maxLength={18} // +7(XXX)-XXX-XX-XX = 18 символов
        />
    );
}
