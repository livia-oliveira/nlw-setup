import { useState, useEffect } from "react";
import { View, ScrollView, Text, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";

import { api } from "../lib/axios";

import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { CheckBox } from "../components/CheckBox";
import { Loading } from "../components/Loading";



interface Parms{
  date: string
}

interface DayInfoProps {
  completedHabits: string[];
  possibleHabits: {
    id: string;
    title: string;
  }[];

}

export function Habit(){
  
  const [loading, setLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null)
  const [completedHabits, setCompletedHabits] = useState<string[]>([])

  const route = useRoute();
  const { date } = route.params as Parms

  const parsedDate = dayjs(date);
  const dayOfWeek = parsedDate.format('dddd');
  const dayAndMonth = parsedDate.format('DD/MM')

  async function fetchHabits(){
    try {
      setLoading(true)

      const response = await api.get('/day', {params: { date }});
      setDayInfo(response.data)
      setCompletedHabits(response.data.completedHabits)
      
    } catch (error) {
      console.log(error)
      Alert.alert('Ops', 'Não foi possível carregar as informações dos hábitos')
    }
    finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHabits()
  },[])

  if(loading){
    return(
      <Loading />
    )
  }

  return(
    <View className="flex-1 bg-background px-8 pt-16 ">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom:100}}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>

        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={90}/>
        
        <View className="mt-6">
          {
            dayInfo?.possibleHabits &&
            dayInfo?.possibleHabits.map(habit => (
             
                <CheckBox 
                  key={habit.id}
                  title={habit.title}
                  checked={completedHabits.includes(habit.id)}
                />
            ))    
          }

        </View>
      </ScrollView>
    </View>
  )
}