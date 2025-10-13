import React, { memo, useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../utils/constants';
import useAppStore from '../../store/useAppStore';

interface AdminAnalyticsScreenProps {
  onBack: () => void;
}

const AdminAnalyticsScreen: React.FC<AdminAnalyticsScreenProps> = memo(({ onBack }) => {
  const { articles, centers } = useAppStore();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Мокап данные пользователей для статистики
  const users = [
    { role: 'admin', status: 'active' },
    { role: 'moderator', status: 'active' },
    { role: 'user', status: 'active' },
    { role: 'user', status: 'blocked' },
    { role: 'user', status: 'pending' }
  ];

  // Расчет общей статистики
  const totalArticles = articles.length;
  const totalCenters = centers.length;
  const totalViews = articles.reduce((sum, article) => sum + (article.views || 0), 0);
  const totalLikes = articles.reduce((sum, article) => sum + (article.likes || 0), 0);
  const avgViews = totalArticles > 0 ? Math.round(totalViews / totalArticles) : 0;
  const avgLikes = totalArticles > 0 ? Math.round(totalLikes / totalArticles) : 0;
  
  const verifiedCenters = centers.filter(center => center.verified).length;
  const avgRating = centers.length > 0 
    ? Math.round((centers.reduce((sum, center) => sum + (center.rating || 0), 0) / centers.length) * 10) / 10
    : 0;

  // Мокап данные для графиков
  const weeklyStats = {
    articles: [2, 3, 1, 4, 2, 3, 2],
    views: [120, 180, 95, 220, 150, 190, 160],
    likes: [8, 12, 6, 15, 10, 13, 11],
    centers: [1, 0, 2, 1, 0, 1, 1]
  };

  const monthlyStats = {
    articles: [12, 15, 18, 22],
    views: [1200, 1500, 1800, 2200],
    likes: [85, 105, 125, 150],
    centers: [3, 2, 4, 3]
  };

  const yearlyStats = {
    articles: [45, 67, 89, 112],
    views: [12000, 18000, 25000, 32000],
    likes: [850, 1200, 1600, 2100],
    centers: [12, 18, 25, 32]
  };

  const getCurrentStats = () => {
    switch (selectedPeriod) {
      case 'week': return weeklyStats;
      case 'month': return monthlyStats;
      case 'year': return yearlyStats;
      default: return monthlyStats;
    }
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'week': return 'За неделю';
      case 'month': return 'За месяц';
      case 'year': return 'За год';
      default: return 'За месяц';
    }
  };

  const getPeriodLabels = () => {
    switch (selectedPeriod) {
      case 'week': return ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
      case 'month': return ['Неделя 1', 'Неделя 2', 'Неделя 3', 'Неделя 4'];
      case 'year': return ['Q1', 'Q2', 'Q3', 'Q4'];
      default: return ['Неделя 1', 'Неделя 2', 'Неделя 3', 'Неделя 4'];
    }
  };

  const renderStatCard = (title: string, value: string | number, icon: string, color: string = THEME.primary) => (
    <View style={styles.statCard}>
      <View style={styles.statCardHeader}>
        <Ionicons name={icon as any} size={24} color={color} />
        <Text style={styles.statCardTitle}>{title}</Text>
      </View>
      <Text style={[styles.statCardValue, { color }]}>{value}</Text>
    </View>
  );

  const renderChart = (title: string, data: number[], labels: string[], color: string = THEME.primary) => {
    const maxValue = Math.max(...data);
    
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>{title}</Text>
        <View style={styles.chart}>
          {data.map((value, index) => (
            <View key={index} style={styles.chartBar}>
              <View 
                style={[
                  styles.chartBarFill, 
                  { 
                    height: `${(value / maxValue) * 100}%`,
                    backgroundColor: color
                  }
                ]} 
              />
              <Text style={styles.chartLabel}>{labels[index]}</Text>
              <Text style={styles.chartValue}>{value}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Заголовок с навигацией */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
        >
          <Ionicons name="arrow-back" size={24} color={THEME.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Аналитика и статистика</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onBack}
        >
          <Ionicons name="close" size={24} color={THEME.muted} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Период */}
        <View style={styles.periodContainer}>
          <Text style={styles.sectionTitle}>Период анализа</Text>
          <View style={styles.periodButtons}>
            <TouchableOpacity
              style={[styles.periodButton, selectedPeriod === 'week' && styles.periodButtonActive]}
              onPress={() => setSelectedPeriod('week')}
            >
              <Text style={[styles.periodButtonText, selectedPeriod === 'week' && styles.periodButtonTextActive]}>
                Неделя
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.periodButton, selectedPeriod === 'month' && styles.periodButtonActive]}
              onPress={() => setSelectedPeriod('month')}
            >
              <Text style={[styles.periodButtonText, selectedPeriod === 'month' && styles.periodButtonTextActive]}>
                Месяц
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.periodButton, selectedPeriod === 'year' && styles.periodButtonActive]}
              onPress={() => setSelectedPeriod('year')}
            >
              <Text style={[styles.periodButtonText, selectedPeriod === 'year' && styles.periodButtonTextActive]}>
                Год
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Общая статистика */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Общая статистика</Text>
          <View style={styles.statsGrid}>
            {renderStatCard('Всего статей', totalArticles, 'document-text-outline', THEME.primary)}
            {renderStatCard('Всего центров', totalCenters, 'business-outline', '#00aa00')}
            {renderStatCard('Просмотров', totalViews.toLocaleString(), 'eye-outline', '#ff8800')}
            {renderStatCard('Лайков', totalLikes.toLocaleString(), 'heart-outline', '#ff4444')}
            {renderStatCard('Среднее просмотров', avgViews, 'trending-up-outline', THEME.primary)}
            {renderStatCard('Среднее лайков', avgLikes, 'thumbs-up-outline', '#ff4444')}
            {renderStatCard('Верифицированных центров', verifiedCenters, 'checkmark-circle-outline', '#00aa00')}
            {renderStatCard('Средний рейтинг', avgRating, 'star-outline', '#ffaa00')}
          </View>
        </View>

        {/* Статистика по статьям */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Статистика по статьям</Text>
          <View style={styles.statsGrid}>
            {renderStatCard('Всего статей', totalArticles, 'document-text-outline', THEME.primary)}
            {renderStatCard('Общие просмотры', totalViews.toLocaleString(), 'eye-outline', '#ff8800')}
            {renderStatCard('Общие лайки', totalLikes.toLocaleString(), 'heart-outline', '#ff4444')}
            {renderStatCard('Среднее просмотров', avgViews, 'trending-up-outline', THEME.primary)}
          </View>
        </View>

        {/* Статистика по центрам */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Статистика по центрам</Text>
          <View style={styles.statsGrid}>
            {renderStatCard('Всего центров', totalCenters, 'business-outline', '#00aa00')}
            {renderStatCard('Верифицированных', verifiedCenters, 'checkmark-circle-outline', '#00aa00')}
            {renderStatCard('На проверке', totalCenters - verifiedCenters, 'time-outline', '#ff8800')}
            {renderStatCard('Средний рейтинг', avgRating, 'star-outline', '#ffaa00')}
          </View>
        </View>

        {/* Статистика по пользователям */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Статистика по пользователям</Text>
          <View style={styles.statsGrid}>
            {renderStatCard('Всего пользователей', users.length, 'people-outline', THEME.primary)}
            {renderStatCard('Администраторов', users.filter(u => u.role === 'admin').length, 'shield-outline', '#ff4444')}
            {renderStatCard('Модераторов', users.filter(u => u.role === 'moderator').length, 'person-outline', '#ff8800')}
            {renderStatCard('Активных', users.filter(u => u.status === 'active').length, 'checkmark-circle-outline', '#00aa00')}
            {renderStatCard('Заблокированных', users.filter(u => u.status === 'blocked').length, 'lock-closed-outline', '#ff4444')}
            {renderStatCard('Ожидающих', users.filter(u => u.status === 'pending').length, 'time-outline', '#ff8800')}
          </View>
        </View>

        {/* Динамика */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Динамика {getPeriodLabel()}</Text>
          
          {renderChart(
            'Новые статьи',
            getCurrentStats().articles,
            getPeriodLabels(),
            THEME.primary
          )}
          
          {renderChart(
            'Просмотры статей',
            getCurrentStats().views,
            getPeriodLabels(),
            '#ff8800'
          )}
          
          {renderChart(
            'Лайки статей',
            getCurrentStats().likes,
            getPeriodLabels(),
            '#ff4444'
          )}
          
          {renderChart(
            'Новые центры',
            getCurrentStats().centers,
            getPeriodLabels(),
            '#00aa00'
          )}
        </View>

        {/* Топ контент */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Топ контент</Text>
          
          <View style={styles.topContentContainer}>
            <Text style={styles.topContentSubtitle}>Самые популярные статьи</Text>
            {articles
              .sort((a, b) => (b.views || 0) - (a.views || 0))
              .slice(0, 5)
              .map((article, index) => (
                <View key={article.id} style={styles.topContentItem}>
                  <Text style={styles.topContentRank}>#{index + 1}</Text>
                  <View style={styles.topContentInfo}>
                    <Text style={styles.topContentTitle} numberOfLines={1}>
                      {article.title}
                    </Text>
                    <Text style={styles.topContentStats}>
                      {article.views || 0} просмотров • {article.likes || 0} лайков
                    </Text>
                  </View>
                </View>
              ))}
          </View>

          <View style={styles.topContentContainer}>
            <Text style={styles.topContentSubtitle}>Лучшие центры по рейтингу</Text>
            {centers
              .sort((a, b) => (b.rating || 0) - (a.rating || 0))
              .slice(0, 5)
              .map((center, index) => (
                <View key={center.id} style={styles.topContentItem}>
                  <Text style={styles.topContentRank}>#{index + 1}</Text>
                  <View style={styles.topContentInfo}>
                    <Text style={styles.topContentTitle} numberOfLines={1}>
                      {center.name}
                    </Text>
                    <Text style={styles.topContentStats}>
                      ⭐ {center.rating || 0} • {center.reviewsCount || 0} отзывов
                    </Text>
                  </View>
                </View>
              ))}
          </View>
        </View>

        {/* Экспорт данных */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Экспорт данных</Text>
          <View style={styles.exportButtons}>
            <TouchableOpacity style={styles.exportButton}>
              <Ionicons name="download-outline" size={20} color="#fff" />
              <Text style={styles.exportButtonText}>Экспорт в Excel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportButton}>
              <Ionicons name="document-outline" size={20} color="#fff" />
              <Text style={styles.exportButtonText}>Отчет PDF</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
});

AdminAnalyticsScreen.displayName = 'AdminAnalyticsScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  periodContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
  },
  periodButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.primary,
    backgroundColor: '#fff',
  },
  periodButtonActive: {
    backgroundColor: THEME.primary,
  },
  periodButtonText: {
    fontSize: 14,
    color: THEME.primary,
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statCardTitle: {
    fontSize: 12,
    color: THEME.muted,
    marginLeft: 8,
    fontWeight: '500',
  },
  statCardValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  chartContainer: {
    marginBottom: 30,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingHorizontal: 10,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 4,
    marginBottom: 8,
    minHeight: 4,
  },
  chartLabel: {
    fontSize: 10,
    color: THEME.muted,
    marginBottom: 2,
  },
  chartValue: {
    fontSize: 10,
    color: '#333',
    fontWeight: '600',
  },
  topContentContainer: {
    marginBottom: 20,
  },
  topContentSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  topContentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  topContentRank: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.primary,
    width: 30,
  },
  topContentInfo: {
    flex: 1,
    marginLeft: 10,
  },
  topContentTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  topContentStats: {
    fontSize: 12,
    color: THEME.muted,
  },
  exportButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  exportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AdminAnalyticsScreen;
