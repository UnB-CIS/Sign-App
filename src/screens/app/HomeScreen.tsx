import React, { use, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const CourseCard = ({ title, progress, onPress }) => {
  const isCompleted = progress >= 100;

  return (
    <View style={styles.cardContainer}>

      {/* 1. Header: Title and Percentage */}
      <View style={styles.headerRow}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.percentageText}>{progress}%</Text>
      </View>

      {/* 2. Progress Bar */}
      <View style={styles.progressBarTrack}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${progress}%` } // Dynamic width based on prop
          ]}
        />
      </View>

      {/* 3. Footer: Status Text */}
      <TouchableOpacity activeOpacity={0.7} style={styles.footer} onPress={onPress}>
        {isCompleted ? (
          <View style={styles.completedContainer}>
            <Text style={styles.completedText}>Concluído</Text>
            {/* Simple Unicode Checkmark (No icon library needed) */}
            <Text style={styles.checkIcon}> ✓</Text>
          </View>
        ) : (
          <Text style={styles.continueText}>Continuar</Text>
        )}
      </TouchableOpacity>

    </View>
  );
};
export default function HomeScreen() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Fetch courses from database
  useEffect(() => {
    fetchCourses();
  }, []);


  const fetchCourses = async () => {
    try {

      const mockCourses = [
        { id: '1', title: 'Alimentos', progress: 100 },
        { id: '2', title: 'Saudações', progress: 75 },
        { id: '3', title: 'Números', progress: 45 },
      ];
      setCourses(mockCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardPress = (courseId, title) => {
    // Navigate with parameters
    //navigation.navigate('CourseDetail', {
    //  courseId,
    //  title
    //});

    Alert.alert('Navegar para o curso:', `${title} (ID: ${courseId})`);
  };
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Módulos</Text>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CourseCard
            title={item.title}
            progress={item.progress}
            onPress={() => handleCardPress(item.id, item.title)}
          />
        )}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'blue',
    marginBottom: 20,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#6379F2', // The main blue outline color
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 20, // Space between cards
    // Optional shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleText: {
    fontSize: 16,
    color: '#7A869A', // Grayish text for title
    fontWeight: '500',
  },
  percentageText: {
    fontSize: 16,
    color: '#7A869A',
    fontWeight: '500',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#F0F2F5', // Light gray background for bar
    borderRadius: 4,
    marginBottom: 15,
    overflow: 'hidden', // Ensures the inner bar stays within rounded corners
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2D4CC8', // The strong blue fill color
    borderRadius: 4,
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D4CC8', // Blue text
  },
  completedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D4CC8', // Blue text
  },
  checkIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00C853', // Green color for the checkmark
    marginLeft: 6,
  },
});
