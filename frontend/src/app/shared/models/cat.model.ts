export interface Cat {
  id: string;
  name: string;
  age?: string;
  breed?: string;
  image?: string;
  gallery?: string[];
  personality?: string | string[];
  story?: string;
  description?: string;
  isSpecialNeeds?: boolean;
  vaccinated?: boolean;
  sterilized?: boolean;
  gender?: 'male' | 'female';
}

export interface DetailedCat extends Cat {
  mainImage: string;
  gallery: string[];
  personality: string[];
  story: string;
  description: string;
  characteristics: {
    birthDate: string;
    gender: string;
    size: string;
    activityLevel: string;
    healthStatus: string;
    arrivedAt: string;
  };
  adoptionProcess: Array<{
    step: number;
    title: string;
    description: string;
    color: string;
  }>;
}