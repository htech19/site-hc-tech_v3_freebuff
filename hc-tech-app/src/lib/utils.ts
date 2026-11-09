import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(num);
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  
  if (digits.length <= 2) {
    return `(${digits}`;
  }
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function generateOSNumber(existingNumbers: string[]): string {
  const maxNum = existingNumbers.reduce((max, num) => {
    const numOnly = parseInt(num.replace(/\D/g, ''), 10);
    return numOnly > max ? numOnly : max;
  }, 0);
  
  const nextNum = maxNum + 1;
  return `OS-${nextNum.toString().padStart(4, '0')}`;
}

export function generateBudgetNumber(existingNumbers: string[]): string {
  const maxNum = existingNumbers.reduce((max, num) => {
    const numOnly = parseInt(num.replace(/\D/g, ''), 10);
    return numOnly > max ? numOnly : max;
  }, 0);
  
  const nextNum = maxNum + 1;
  return `ORC-${nextNum.toString().padStart(4, '0')}`;
}

export function calculateBudget(
  custoPecas: number,
  frete: number,
  outrosCustos: number,
  valorVendaPecas: number,
  maoDeObra: number,
  desconto: number
) {
  const custoTotal = custoPecas + frete + outrosCustos;
  const valorFinal = valorVendaPecas + maoDeObra - desconto;
  const lucroBruto = valorFinal - custoTotal;
  const margemBruta = valorFinal > 0 ? (lucroBruto / valorFinal) * 100 : 0;
  
  return {
    custoTotal,
    valorFinal,
    lucroBruto,
    margemBruta: Math.round(margemBruta * 100) / 100,
  };
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}
