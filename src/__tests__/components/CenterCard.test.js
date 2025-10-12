import { render, fireEvent } from '@testing-library/react-native';
import CenterCard from '../../components/common/CenterCard';

// Mock данные для тестирования
const mockCenter = {
  id: '1',
  name: 'Тестовый центр',
  city: 'Москва',
  address: 'ул. Тестовая, 1',
  phone: '+7 (495) 123-45-67',
  email: 'test@center.ru',
  rating: 4.5,
  reviewsCount: 25,
  verified: true,
  photos: ['https://example.com/photo1.jpg'],
  services: ['Консультация', 'Детокс', 'Реабилитация'],
  description: 'Краткое описание центра',
  price: '50 000 ₽/месяц',
  coordinates: { latitude: 55.7558, longitude: 37.6176 },
  workingHours: 'Пн-Вс: 9:00-21:00',
  capacity: 50,
  yearFounded: 2010,
  license: 'ЛО-77-01-123456',
  descriptionFull: 'Полное описание центра',
  methods: ['12 шагов', 'КПТ'],
  reviews: []
};

describe('CenterCard', () => {
  const mockOnPress = jest.fn();
  const mockOnToggleFavorite = jest.fn();
  const mockIsFavorite = jest.fn(() => false);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders center information correctly', () => {
    const { getByText } = render(
      <CenterCard 
        item={mockCenter} 
        onPress={mockOnPress}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={mockIsFavorite}
      />
    );

    expect(getByText('Тестовый центр')).toBeTruthy();
    expect(getByText('Москва')).toBeTruthy();
    expect(getByText('Консультация')).toBeTruthy();
    expect(getByText('Краткое описание центра')).toBeTruthy();
    expect(getByText('50 000 ₽/месяц')).toBeTruthy();
    expect(getByText('4.5')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByText } = render(
      <CenterCard 
        item={mockCenter} 
        onPress={mockOnPress}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={mockIsFavorite}
      />
    );

    fireEvent.press(getByText('Тестовый центр'));
    expect(mockOnPress).toHaveBeenCalledWith(mockCenter);
  });

  it('handles missing photos gracefully', () => {
    const centerWithoutPhotos = {
      ...mockCenter,
      photos: []
    };

    const { getByText } = render(
      <CenterCard 
        item={centerWithoutPhotos} 
        onPress={mockOnPress}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={mockIsFavorite}
      />
    );

    expect(getByText('Тестовый центр')).toBeTruthy();
  });

  it('handles long text with ellipsis', () => {
    const centerWithLongName = {
      ...mockCenter,
      name: 'Очень длинное название центра реабилитации которое должно обрезаться'
    };

    const { getByText } = render(
      <CenterCard 
        item={centerWithLongName} 
        onPress={mockOnPress}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={mockIsFavorite}
      />
    );

    const nameElement = getByText(/Очень длинное название/);
    expect(nameElement).toBeTruthy();
  });

  it('displays correct rating format', () => {
    const centerWithDecimalRating = {
      ...mockCenter,
      rating: 4.7
    };

    const { getByText } = render(
      <CenterCard 
        item={centerWithDecimalRating} 
        onPress={mockOnPress}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={mockIsFavorite}
      />
    );

    expect(getByText('4.7')).toBeTruthy();
  });
});
