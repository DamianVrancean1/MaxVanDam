import { getApiUrl } from '../config/api';

export interface CreateSubscriptionData {
  planId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: string;
  expiryYear: string;
  amount: number;
}

export interface SubscriptionInfo {
  id: number;
  planId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  cardHolderName: string;
  cardNumberMasked: string;
  amount: number;
  status: string;
  purchaseDate: string;
  expirationDate: string;
}

const API_URL = getApiUrl();

export const subscriptionService = {
  async createSubscription(data: CreateSubscriptionData): Promise<SubscriptionInfo> {
    const response = await fetch(`${API_URL}/api/subscriptions/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Eroare la crearea abonamentului');
    }

    return response.json();
  },

  async getSubscriptions(): Promise<SubscriptionInfo[]> {
    const response = await fetch(`${API_URL}/api/subscriptions/list`);

    if (!response.ok) {
      throw new Error('Eroare la preluarea abonamentelor');
    }

    return response.json();
  },

  async getSubscriptionById(id: number): Promise<SubscriptionInfo> {
    const response = await fetch(`${API_URL}/api/subscriptions/${id}`);

    if (!response.ok) {
      throw new Error('Eroare la preluarea abonamentului');
    }

    return response.json();
  },

  async cancelSubscription(id: number): Promise<string> {
    const response = await fetch(`${API_URL}/api/subscriptions/${id}/cancel`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Eroare la anularea abonamentului');
    }

    return response.json();
  },
};

