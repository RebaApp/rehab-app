// App.js — RehaBnB v8 (final fixes: card sizing, carousel behavior, filters, typography)
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity, Image, ScrollView,
  TextInput, Linking, Platform, Animated, Dimensions, Modal, SafeAreaView,
  KeyboardAvoidingView, Alert
} from "react-native";

// Firebase integration (added by assistant)
import { auth, db, storage } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_W } = Dimensions.get("window");

const THEME = {
  bgTop: "#e6f3ff",
  bgMid: "#cfeeff",
  bgBottom: "#9fd6ff",
  card: "#ffffff",
  muted: "#5f6b75",
  primary: "#1a84ff",
  pillBg: "#e7f3ff",
  radius: 14,
  shadow: { shadowColor: "#0a2740", shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 }
};

const FALLBACK_IMAGE = "https://dl.dropboxusercontent.com/scl/fi/p6kykjgdqqh30tjzos8sx/.jpg?rlkey=64a998ru6v232v0d6hu699gei&st=oj6hjqh7&dl=0";
const WATER = [
    "https://dl.dropboxusercontent.com/scl/fi/9c70ynhqzordogik637yd/.jpg?rlkey=nwb5m7c7aaxc4avpwyknqe5we&st=cfw20d71&dl=0",
  "https://dl.dropboxusercontent.com/scl/fi/p6kykjgdqqh30tjzos8sx/.jpg?rlkey=64a998ru6v232v0d6hu699gei&st=oj6hjqh7&dl=0",
  "https://dl.dropboxusercontent.com/scl/fi/arjafa6f6yg0gj5yavh9e/.jpg?rlkey=p6j12v96x53dn920n05s2figf&st=p5qvovh4&dl=0",
  "https://dl.dropboxusercontent.com/scl/fi/gane6z64nqzscbn1u5hg6/.jpg?rlkey=jf0fu8h2107k25meeaf05joov&st=oa14bxyt&dl=0",
  "https://dl.dropboxusercontent.com/scl/fi/n0fvkwjfxt8savnziq6tx/.jpg?rlkey=aeblpu1mml5d9pes7lnqfhbww&st=7whfctvo&dl=0"

];

// 10 articles
const ARTICLES = [
  { id:"a1", title:"Алкогольная зависимость: почему это болезнь, а не слабость", excerpt:"Природа зависимости и комплексный подход.", image: WATER[0], body:"Алкогольная зависимость — хроническое заболевание. Лечение сочетает детокс, медикаментозную поддержку и психотерапию." },
  { id:"a2", title:"Наркозависимость: детокс — это начало", excerpt:"Детокс — начало долгого пути.", image: WATER[1], body:"Детокс важен, но без реабилитации риск рецидива высок." },
  { id:"a3", title:"Игровое расстройство: как вернуть контроль", excerpt:"КПТ, ограничения доступа и работа с семьёй.", image: WATER[2], body:"Игровое расстройство — поведенческая зависимость. КПТ и финансовая реабилитация помогают восстановить контроль." },
  { id:"a4", title:"Никотиновая зависимость: комбинированный план", excerpt:"НЗТ и поведенческая поддержка.", image: WATER[3], body:"Комбинация фармакотерапии и терапии даёт лучшие результаты." },
  { id:"a5", title:"Роль семьи в реабилитации", excerpt:"Как вовлечь близких без вреда.", image: WATER[4], body:"Семейная терапия улучшает результаты и снижает риск рецидива." },
  { id:"a6", title:"Длительная поддержка после выписки", excerpt:"Что нужно для устойчивой ремиссии.", image: WATER[0], body:"План после выписки, группы поддержки и регулярный контроль." },
  { id:"a7", title:"Подготовка к реабилитации", excerpt:"Практические шаги перед госпитализацией.", image: WATER[1], body:"Подготовка включает документы, психологическую готовность и бытовые решения." },
  { id:"a8", title:"Коморбидность: депрессия и зависимость", excerpt:"Почему важно лечить оба состояния.", image: WATER[2], body:"Коморбидные расстройства ухудшают прогноз — лечим комплексно." },
  { id:"a9", title:"Профилактика рецидива", excerpt:"Практические меры и план действий.", image: WATER[3], body:"Работа с триггерами, план быстрых действий и поддержка." },
  { id:"a10", title:"Современная программа реабилитации", excerpt:"Этапы: диагностика → детокс → терапия → ресоциализация.", image: WATER[4], body:"Этапы программы: диагностика, детокс, терапия, реинтеграция." }
];

const CENTER_NAMES = [
  "Наркологический центр «Новый Век»",
  "Реабилитационный центр «Альфа»",
  "Клиника восстановления «Медикус»",
  "Реабилитационный центр «Возрождение»",
  "Медицинский центр «Маяк»",
  "Центр «Компас»",
  "Реабилитационный дом «Ясный»",
  "Центр «Рука поддержки»",
  "Клиника «Второй шанс»",
  "Медицинский центр «Трезвость»",
  "Клинико-реабилитационный центр «Фокус»",
  "Центр помощи «Ресурс»",
  "Реабилитационный институт «Путь домой»",
  "Клиника «Альтернатива»",
  "Реабилитационный центр «Основа»",
  "Центр «Шаг Вперёд»",
  "Клиника «Вдох»",
  "Центр «Надежда и сила»",
  "Региональный центр «Опора»",
  "Клиника «Пульс»"
];

const CITIES = ["Москва","Санкт-Петербург","Казань","Екатеринбург","Новосибирск","Сочи","Ростов-на-Дону","Краснодар","Пермь","Челябинск"];
const DEP_TYPES = ["алкоголизм","наркозависимость","лудомания","никотиновая зависимость"];

function generateCenters() {
  const ratingArr = [4.8,3.2,2.9,4.4,5.0,3.7,2.1,4.0,4.5,3.0,2.5,3.8,4.2,2.7,4.9,3.3,4.1,2.2,3.6,4.7];
  return CENTER_NAMES.map((name,i)=>{
    const types = [DEP_TYPES[i % DEP_TYPES.length]];
    const photos = [
      WATER[i % WATER.length] + "&auto=format&fit=crop&w=900&q=60",
      WATER[(i+1) % WATER.length] + "&auto=format&fit=crop&w=900&q=60"
    ];
    const desc = `${name} — клинически выверенная программа: медицинский детокс, индивидуальная и групповая психотерапия, поствыписной план поддержки.`;
    const shortBlurbMap = {
      "алкоголизм":"Помощь в снижении тяги и восстановлении социальной функции",
      "наркозависимость":"Детокс и длительная реабилитация с медикаментозной поддержкой",
      "лудомания":"КПТ и финансовая реабилитация",
      "никотиновая зависимость":"НЗТ и поведенческая поддержка"
    };
    const blurb = types.map(t=> shortBlurbMap[t] || t).join("; ");
    const reviews = [];
    for(let j=0;j<10;j++){
      const r = Math.max(1, Math.min(5, Math.round(ratingArr[i%ratingArr.length] + ((j%3)-1)*0.4)));
      reviews.push({ id: `${i}-r${j}`, user: ["Иван","Ольга","Сергей","Мария","Наталья","Дмитрий","Елена","Павел","Юлия","Алексей"][j%10], rating: r, date: `${3+j} дней назад`, text: ["Профессиональная команда и индивидуальный подход.","Хорошая программа, вижу прогресс.","Поддержка после выписки помогла."][j%3] });
    }
    return {
      id: `c${i+1}`,
      name,
      city: CITIES[i % CITIES.length],
      types,
      price: ["от 45 000 ₽ / 14 дней","от 60 000 ₽ / 21 день","от 35 000 ₽ / 10 дней"][i%3],
      days: [14,21,10][i%3],
      format: i%2===0 ? "Стационар" : "Амбулаторно",
      family: i%2===0,
      rating: ratingArr[i%ratingArr.length],
      photos,
      description: desc,
      descriptionShort: blurb + ".",
      programsExtended: [
      "Индивидуальная программа детоксикации и медикаментозной поддержки с круглосуточным наблюдением врачей.",
      "Когнитивно-поведенческая терапия (КПТ), групповая и семейная терапия, мотивационное интервьюирование.",
      "Реабилитационные мероприятия: трудотерапия, спортивные и творческие активности, план после выписки и поддержка сообщества."
      ],
      methods: ["Медикаментозная терапия","КПТ (когнитивно-поведенческая терапия)","Семейная терапия","Психосоциальная реабилитация"],
      reviews,
      phone: `+7 (900) 00${i}${i}`,
      email: `info${i}@example.com`,
      website: `www.example${i}.com`
    };
  });
}

const parsePrice = (p)=>{ const m = p.match(/(\d+)\s*000/); return m ? Number(m[1])*1000 : 0; };
const openMap = (n,c)=> { const q=encodeURIComponent(n+" "+c); const url = Platform.OS==="ios"?`http://maps.apple.com/?q=${q}`:`https://www.google.com/maps/search/?api=1&query=${q}`; Linking.openURL(url).catch(()=>{}); };

export default function App(){
  const [centers, setCenters] = useState(generateCenters());
  const [tab,setTab] = useState("home");
  const [query,setQuery] = useState("");
  const [filtersVisible,setFiltersVisible] = useState(false);
  const [selectedCenter,setSelectedCenter] = useState(null);
  const [articleOpen,setArticleOpen] = useState(null);
  const [articleComments,setArticleComments] = useState({});
  const [likedArticles,setLikedArticles] = useState({});
  const [requestModalVisible,setRequestModalVisible] = useState(false);
  const [currentRequestCenter,setCurrentRequestCenter] = useState(null);
  const [favorites,setFavorites] = useState({});
  const [requests,setRequests] = useState([]);

  const [filterCities, setFilterCities] = useState([]);
  const [filterTypes, setFilterTypes] = useState([]); // dependency types
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);

  const slide = useRef(new Animated.Value(SCREEN_W)).current;
  const shimmer = useRef(new Animated.Value(0.3)).current;

// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(()=>{
    AsyncStorage.getItem("reba:favorites_v1").then(v=> v && setFavorites(JSON.parse(v))).catch(()=>{});
    AsyncStorage.getItem("reba:articleComments_v1").then(v=> v && setArticleComments(JSON.parse(v))).catch(()=>{});
    AsyncStorage.getItem("reba:requests_v1").then(v=> v && setRequests(JSON.parse(v))).catch(()=>{});
    AsyncStorage.getItem("reba:liked_articles_v1").then(v=> v && setLikedArticles(JSON.parse(v))).catch(()=>{});
    Animated.loop(Animated.sequence([Animated.timing(shimmer,{ toValue:0.9, duration:1200, useNativeDriver:true }), Animated.timing(shimmer,{ toValue:0.3, duration:1200, useNativeDriver:true })])).start();
  },[]);

// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(()=>{ if(selectedCenter || articleOpen){ slide.setValue(SCREEN_W); Animated.spring(slide,{ toValue:0, useNativeDriver:true }).start(); } },[selectedCenter, articleOpen]);

  const toggleFav = async(id)=>{ const copy = {...favorites}; if(copy[id]) delete copy[id]; else copy[id]=true; setFavorites(copy); await AsyncStorage.setItem("reba:favorites_v1", JSON.stringify(copy)).catch(()=>{}); };
  const saveRequest = async(req)=>{ const copy = [req].concat(requests); setRequests(copy); await AsyncStorage.setItem("reba:requests_v1", JSON.stringify(copy)).catch(()=>{}); };
  const addArticleComment = async(aid, comment)=>{ const copy = {...articleComments}; if(!copy[aid]) copy[aid]=[]; copy[aid].unshift({ id: Date.now().toString(), text: comment, date: new Date().toLocaleString() }); setArticleComments(copy); await AsyncStorage.setItem("reba:articleComments_v1", JSON.stringify(copy)).catch(()=>{}); };
  const toggleLikeArticle = async(id)=>{ const copy = {...likedArticles}; if(copy[id]) delete copy[id]; else copy[id]=true; setLikedArticles(copy); await AsyncStorage.setItem("reba:liked_articles_v1", JSON.stringify(copy)).catch(()=>{}); };

  // filter apply
  const applyFilters = ()=>{
    let list = generateCenters();
    if(filterCities.length>0) list = list.filter(c => filterCities.includes(c.city));
    if(filterTypes.length>0) list = list.filter(c => filterTypes.some(t=> c.types.includes(t)));
    if(minPrice) list = list.filter(c => parsePrice(c.price) >= Number(minPrice));
    if(maxPrice) list = list.filter(c => parsePrice(c.price) <= Number(maxPrice));
    if(minRating) list = list.filter(c => c.rating >= Number(minRating));
    setCenters(list);
    setFiltersVisible(false);
  };
  const resetFilters = ()=>{ setFilterCities([]); setFilterTypes([]); setMinPrice(""); setMaxPrice(""); setMinRating(0); setCenters(generateCenters()); setFiltersVisible(false); };

  const filteredCenters = (q)=>{
    const list = centers;
    if(!q) return list;
    const qc = q.toLowerCase();
    return list.filter(c => (c.name + " " + c.city + " " + c.description).toLowerCase().includes(qc));
  };

  // Center card (preview) layout fixed height, title less bold, types on separate line
  const CenterCard = ({ item, onOpen })=>{
    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.95} onPress={()=> onOpen(item)}>
        <View style={styles.cardImageWrap}><Image source={{ uri: item.photos[0] || FALLBACK_IMAGE }} style={styles.cardImage} resizeMode="cover" /></View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2} ellipsizeMode="tail">{item.name}</Text>
          <View style={{ flexDirection:"row", alignItems:"center", marginTop:8 }}>
            <View style={styles.cityPill}><Text style={styles.cityPillText}>{item.city}</Text></View>
          </View>
          <Text style={styles.typesText} numberOfLines={1}>{item.types.map(t=> t.charAt(0).toUpperCase()+t.slice(1)).join(", ")}</Text>
          <Text style={styles.cardBlurb} numberOfLines={2}>{item.descriptionShort}</Text>
          <View style={styles.cardBottomRow}>
            <Text style={styles.price}>{item.price}</Text>
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Center detail: carousel inside ScrollView so it scrolls away; use onMomentumScrollEnd for active index
 const CenterDetail = ({ center }) => {
  const [active, setActive] = useState(0);
  const scrollRef = useRef(null);
  const [reviewsExpanded, setReviewsExpanded] = useState(false);
  const reviewsHeight = useRef(new Animated.Value(0)).current;

  const toggleReviews = () => {
    const collapsed = 120;
    const expanded = Math.min(600, (center.reviews || []).length * 120);
    Animated.timing(reviewsHeight, {
      toValue: reviewsExpanded ? collapsed : expanded,
      duration: 400,
      useNativeDriver: false,
    }).start();
    setReviewsExpanded(!reviewsExpanded);
  };

  if (!center) return null;

  return (
    <Animated.View style={[styles.detailOverlay, { transform: [{ translateX: slide }] }]}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.detailHeader}>
          <TouchableOpacity
            onPress={() => {
              Animated.timing(slide, {
                toValue: SCREEN_W,
                duration: 180,
                useNativeDriver: true,
              }).start(() => setSelectedCenter(null));
            }}
            style={styles.backCircle}
          >
            <Text style={{ fontSize: 18 }}>←</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "700", fontSize: 18 }} numberOfLines={2}>
              {center.name}
            </Text>
            <Text style={{ color: THEME.muted }}>
              {center.city} · {center.days} дней · {center.format}
            </Text>
          </View>
        </View>

        {/* Main Scroll */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Photos Carousel */}
          <View style={{ width: SCREEN_W, height: 300 }}>
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
                setActive(idx);
              }}
            >
              {center.photos.map((p, idx) => (
                <Image
                  key={idx}
                  source={{ uri: p || FALLBACK_IMAGE }}
                  style={{ width: SCREEN_W, height: 300 }}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
            <View style={styles.dotsContainer}>
              {center.photos.map((_, i) => (
                <View key={i} style={[styles.dot, i === active ? styles.dotActive : null]} />
              ))}
            </View>
          </View>

          {/* Details */}
          <View style={{ padding: 14 }}>
            <Text style={{ fontWeight: "800", marginBottom: 8 }}>Описание</Text>
            <Text style={{ color: THEME.muted, lineHeight: 20 }}>{center.description}</Text>

            <View style={{ height: 12 }} />
            <TouchableOpacity style={styles.mapButton} onPress={() => openMap(center.name, center.city)}>
              <Text style={{ color: THEME.primary, fontWeight: "800" }}>Посмотреть на карте</Text>
            </TouchableOpacity>

            <Text style={{ fontWeight: "800", marginTop: 14 }}>Программы и услуги</Text>
            <Text style={{ color: THEME.muted, marginTop: 8 }}>{center.descriptionShort}</Text>

            <Text style={{ fontWeight: "800", marginTop: 14 }}>Программы лечения</Text>
            <View style={{ marginTop: 8 }}>
              {(center.programsExtended || []).map((p, idxp) => (
                <View key={idxp} style={{ marginBottom: 10 }}>
                  <Text style={{ fontWeight: "700" }}>{p}</Text>
                </View>
              ))}
            </View>

            <Text style={{ fontWeight: "800", marginTop: 10 }}>Методики</Text>
            <View style={{ marginTop: 8 }}>
              {(center.methods || []).map((m, i) => (
                <Text key={i} style={{ color: THEME.muted, marginTop: 6 }}>
                  {m}
                </Text>
              ))}
            </View>

            {/* Reviews */}
            <Text style={{ fontWeight: "800", marginTop: 16 }}>Отзывы ({center.reviews.length})</Text>
            <View style={{ marginTop: 8 }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{ flex: 1 }}>
                  <View style={{ height: 8, backgroundColor: "#eef7ff", borderRadius: 6, overflow: "hidden", marginBottom: 8 }}>
                    <View
                      style={{
                        width: `${Math.round(
                          ((center.reviews.reduce((a, b) => a + b.rating, 0) / (center.reviews.length || 1)) / 5) * 100
                        )}%`,
                        height: 8,
                        backgroundColor: "#ffd66b",
                      }}
                    />
                  </View>
                </View>
                <TouchableOpacity onPress={toggleReviews}>
                  <Text style={{ color: THEME.primary, marginLeft: 12 }}>Посмотреть все отзывы</Text>
                </TouchableOpacity>
              </View>

              <Animated.View style={{ height: reviewsHeight, overflow: "hidden" }}>
                {center.reviews.map((r) => (
                  <View key={r.id} style={styles.review}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ fontWeight: "700" }}>{r.user}</Text>
                      <Text style={{ color: "#ffb020" }}>
                        {Array(r.rating).fill("★").join("")}
                      </Text>
                    </View>
                    <Text style={{ color: THEME.muted, fontSize: 12 }}>{r.date}</Text>
                    <Text style={{ marginTop: 8 }}>{r.text}</Text>
                  </View>
                ))}
              </Animated.View>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.detailFooter}>
          <TouchableOpacity
            onPress={() => toggleFav(center.id)}
            style={{ padding: 8, marginRight: 8, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontSize: 22 }}>{favorites && favorites[center.id] ? "♥" : "♡"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerBtnPrimary}
            onPress={() => {
              setCurrentRequestCenter(center);
              setRequestModalVisible(true);
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "900" }}>Оставить заявку</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

  
const RequestModal = ({ visible, onClose, center })=>{
    const [name, setName] = useState(""); const [phone, setPhone] = useState(""); const [note, setNote] = useState("");
// eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(()=>{ if(!visible){ setName(""); setPhone(""); setNote(""); } },[visible]);
    const submit = async ()=>{ if(!phone.trim()){ Alert.alert("Ошибка","Пожалуйста введите телефон."); return; } const payload = { center: center ? center.name : "", name, phone, note }; const copy = [...requests, payload]; setRequests(copy); await AsyncStorage.setItem("reba:requests_v1", JSON.stringify(copy)).catch(()=>{}); Alert.alert("Готово","Заявка принята."); onClose(); };
    if(!center) return null;
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <SafeAreaView style={{ flex:1 }}>
          <View style={{ padding:14 }}>
            <View style={{ flexDirection:"row", alignItems:"center", marginBottom:8 }}>
              <TouchableOpacity onPress={onClose} style={{ padding:8, marginRight:6 }}><Text style={{ fontSize:18 }}>←</Text></TouchableOpacity>
              <Text style={{ fontWeight:"900", fontSize:18 }}>{`Заявка в ${center.name}`}</Text>
            </View>
            <TextInput value={name} onChangeText={setName} placeholder="Ваше имя (необязательно)" style={[styles.input, { marginBottom:12 }]} />
            <TextInput value={phone} onChangeText={setPhone} placeholder="Телефон" keyboardType="phone-pad" style={[styles.input, { marginBottom:12 }]} />
            <TextInput value={note} onChangeText={setNote} placeholder="Дополнительная информация о запросе" style={[styles.input, { height:100, textAlignVertical:"top" }]} multiline />
            <View style={{ flexDirection:"row", marginTop:12 }}>
              <TouchableOpacity onPress={onClose} style={[styles.btnSecondary, { flex:1, marginRight:8, borderColor: THEME.primary }]}><Text style={{ color: THEME.primary, fontWeight:"800" }}>Отмена</Text></TouchableOpacity>
              <TouchableOpacity onPress={submit} style={[styles.btnPrimary, { flex:1 }]}><Text style={{ color:"#fff", fontWeight:"800" }}>Отправить</Text></TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };


  const ArticleCard = ({ item })=>(
    <TouchableOpacity style={styles.articleCard} onPress={()=> setArticleOpen(item)} activeOpacity={0.92}>
      <Image source={{ uri: item.image || FALLBACK_IMAGE }} style={styles.articleImage} resizeMode="cover" />
      <View style={{ padding:12 }}>
        <Text style={{ fontWeight:"700", fontSize:16 }}>{item.title}</Text>
        <Text numberOfLines={3} style={{ color: THEME.muted, marginTop:8 }}>{item.excerpt}</Text>
      </View>
    </TouchableOpacity>
  );

  const ArticleDetail = ({ article })=>{
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
  const likeScale = useRef(new Animated.Value(1)).current;
    const [text, setText] = useState(""); const comments = articleComments[article.id] || []; const liked = !!likedArticles[article.id];
    const submit = ()=>{ if(!text.trim()) return; addArticleComment(article.id, text.trim()); setText(""); };
    return (
      <Animated.View style={[styles.detailOverlay, { transform:[{ translateX: slide }] }]}>
        <SafeAreaView style={{ flex:1 }}>
          <View style={styles.detailHeader}>
            <TouchableOpacity onPress={()=> { Animated.timing(slide,{ toValue: SCREEN_W, duration:180, useNativeDriver:true }).start(()=> setArticleOpen(null)); }} style={styles.backCircle}><Text style={{ fontSize:18 }}>←</Text></TouchableOpacity>
            <View style={{ flex:1 }}>
              <Text style={{ fontWeight:"700", fontSize:16 }}>{article.title}</Text>
              <Text style={{ color: THEME.muted, fontSize:12 }}>{article.excerpt}</Text>
            </View>
            
          </View>

          <ScrollView style={{ padding:12 }}>
            <Image source={{ uri: article.image || FALLBACK_IMAGE }} style={{ width:"100%", height:220, borderRadius:10 }} resizeMode="cover" />
            <Text style={{ marginTop:12, color: THEME.muted, lineHeight:20 }}>{article.body}</Text>

            <View style={{ marginTop:14, marginBottom:6 }}>
              <TouchableOpacity onPress={()=> toggleLikeArticle(article.id)} style={{ padding:8 }}><Text style={{ color: liked ? THEME.primary : THEME.muted, fontWeight:"800" }}>{ liked ? "♥ Нравится" : "♡ Нравится" }</Text></TouchableOpacity>
            </View>

            <Text style={{ fontWeight:"800" }}>Комментарии</Text>
            {comments.length===0 ? <Text style={{ color: THEME.muted, marginTop:8 }}>Пока нет комментариев — будь первым.</Text> : comments.map(c=> <View key={c.id} style={{ padding:10, backgroundColor:"#fff", borderRadius:10, marginTop:8, ...THEME.shadow }}><Text style={{ color: THEME.muted, fontSize:12 }}>{c.date}</Text><Text style={{ marginTop:6 }}>{c.text}</Text></View>)}

            <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100}>
              <View style={{ marginTop:14, flexDirection:"row", alignItems:"center" }}>
                <TextInput value={text} onChangeText={setText} placeholder="Оставить комментарий" style={{ flex:1, backgroundColor:"#fff", padding:10, borderRadius:10, marginRight:8 }} />
                <TouchableOpacity onPress={submit} style={[styles.btnPrimary, { paddingVertical:10, paddingHorizontal:14 }]}><Text style={{ color:"#fff", fontWeight:"800" }}>Отправить</Text></TouchableOpacity>
              </View>
            </KeyboardAvoidingView>

            <View style={{ height:80 }} />
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    );
  };

  const HomeScreen = () => (
    <ScrollView contentContainerStyle={{ padding:12 }}>
      <View style={{ alignItems:"center", marginTop:6 }}>
        <View style={{ position:"relative", alignItems:"center" }}>
          <Text style={styles.rebaTitle}>РЕБА</Text>
          <Animated.View pointerEvents="none" style={[styles.shimmerOverlay, { opacity: shimmer.current ? shimmer.current.__getValue ? shimmer.current.__getValue() : 0.3 : 0.3 }]}>
            <LinearGradient colors={["rgba(255,255,255,0)","rgba(255,255,255,0.6)","rgba(255,255,255,0)"]} start={[0,0]} end={[1,0]} style={{ width:200, height:44 }} />
          </Animated.View>
        </View>
        <Text style={styles.rebaSubtitle}>ПОМОЩЬ БЛИЖЕ ЧЕМ КАЖЕТСЯ</Text>
        <TextInput value={query} onChangeText={setQuery} placeholder="Поисковик..." placeholderTextColor="#809bb3" style={styles.heroSearchSmall} />
      </View>

      <View style={{ marginTop:18 }}>
        <Text style={{ fontWeight:"800", fontSize:16, marginBottom:10 }}>Мы пишем полезности:</Text>
        <FlatList data={ARTICLES} keyExtractor={i=>i.id} renderItem={({item}) => <ArticleCard item={item} />} ItemSeparatorComponent={()=> <View style={{ height:12 }} />} />
      </View>
      <View style={{ height:120 }} />
    </ScrollView>
  );

  const SearchScreen = ()=>(
    <View style={{ flex:1 }}>
      <View style={{ padding:12, flexDirection:"row", alignItems:"center", justifyContent:"space-between" }}>
        <TextInput value={query} onChangeText={setQuery} placeholder="Поиск по центрам, городу..." style={[styles.searchInput, { flex:1 }]} />
        <TouchableOpacity style={styles.filterPillTop} onPress={()=> setFiltersVisible(true)}><Text style={{ fontWeight:"700", color: THEME.primary }}>Фильтры</Text></TouchableOpacity>
      </View>
      <FlatList data={filteredCenters(query)} keyExtractor={i=>i.id} renderItem={({item}) => <CenterCard item={item} onOpen={c=> setSelectedCenter(c)} />} ItemSeparatorComponent={()=> <View style={{ height:12 }} />} contentContainerStyle={{ padding:12 }} />
    </View>
  );

  const FavoritesScreen = ()=>{
    const favList = centers.filter(c => favorites[c.id]);
    if(favList.length===0) return (<View style={{ flex:1, alignItems:"center", justifyContent:"center", padding:24 }}><Text style={{ color: THEME.muted, textAlign:"center" }}>Пока нет избранных центров.</Text><TouchableOpacity style={[styles.btnPrimary, { marginTop:16 }]} onPress={()=> setTab("search")}><Text style={{ color:"#fff", fontWeight:"800" }}>Перейти в Поиск</Text></TouchableOpacity></View>);
    return (<View style={{ flex:1 }}><FlatList data={favList} keyExtractor={i=>i.id} renderItem={({item}) => <CenterCard item={item} onOpen={c=> setSelectedCenter(c)} />} ItemSeparatorComponent={()=> <View style={{ height:12 }} />} contentContainerStyle={{ padding:12 }} /></View>);
  };

  const ProfileScreen = ()=>(
    <ScrollView contentContainerStyle={{ padding:12 }}>
      <Text style={{ fontWeight:"900", fontSize:18, marginBottom:12 }}>Профиль</Text>
      <TouchableOpacity style={styles.profileBtn} onPress={()=> Alert.alert("Вход","Демо")}><Text style={{ fontWeight:"800" }}>Вход</Text></TouchableOpacity>
      <TouchableOpacity style={styles.profileBtn} onPress={()=> Alert.alert("Регистрация","Демо")}><Text style={{ fontWeight:"800" }}>Регистрация</Text></TouchableOpacity>
      <View style={{ marginTop:16 }}>
        <TouchableOpacity style={styles.profileLink} onPress={()=> Alert.alert("О нас","Демо")}><Text>О нас</Text></TouchableOpacity>
        <TouchableOpacity style={styles.profileLink} onPress={()=> Alert.alert("Соглашения","Демо")}><Text>Соглашения</Text></TouchableOpacity>
        <TouchableOpacity style={styles.profileLink} onPress={()=> Alert.alert("Тарифы","Демо")}><Text>Тарифы</Text></TouchableOpacity>
        <TouchableOpacity style={styles.profileLink} onPress={()=> Alert.alert("Связаться","saotusalogin@yandex.ru")}><Text>Контакты</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );

  // Filters modal with dependency-type chips restored
  const FiltersModal = ()=>{
    const [selCities, setSelCities] = useState(filterCities || []);
    const [selTypes, setSelTypes] = useState(filterTypes || []);
    const [minP, setMinP] = useState(minPrice || "");
    const [maxP, setMaxP] = useState(maxPrice || "");
    const [minR, setMinR] = useState(minRating ? String(minRating) : "");
    const toggleCityLocal = (city)=>{ const copy=[...selCities]; const idx=copy.indexOf(city); if(idx>=0) copy.splice(idx,1); else copy.push(city); setSelCities(copy); };
    const toggleTypeLocal = (t)=>{ const copy=[...selTypes]; const idx=copy.indexOf(t); if(idx>=0) copy.splice(idx,1); else copy.push(t); setSelTypes(copy); };
    return (
      <Modal visible={filtersVisible} animationType="slide" onRequestClose={()=> setFiltersVisible(false)}>
        <SafeAreaView style={{ flex:1 }}>
          <ScrollView contentContainerStyle={{ padding:14 }}>
            <Text style={{ fontSize:18, fontWeight:"900" }}>Фильтры</Text>

            <View style={{ marginTop:12 }}>
              <Text style={{ fontWeight:"700", marginBottom:8 }}>Города</Text>
              <View style={{ flexDirection:"row", flexWrap:"wrap" }}>
                {CITIES.map(city=>{ const sel = selCities.includes(city); return (<TouchableOpacity key={city} onPress={()=> toggleCityLocal(city)} style={[styles.filterChip, sel ? styles.filterChipActive : null]}><Text style={[styles.filterChipText, sel ? { color:"#fff"} : null]}>{city}</Text></TouchableOpacity>); })}
              </View>
            </View>

            <View style={{ marginTop:16 }}>
              <Text style={{ fontWeight:"700", marginBottom:8 }}>Тип зависимости</Text>
              <View style={{ flexDirection:"row", flexWrap:"wrap" }}>
                {DEP_TYPES.map(t=>{ const sel=selTypes.includes(t); return (<TouchableOpacity key={t} onPress={()=> toggleTypeLocal(t)} style={[styles.filterChip, sel ? styles.filterChipActive : null]}><Text style={[styles.filterChipText, sel ? { color:"#fff"} : null]}>{t.charAt(0).toUpperCase()+t.slice(1)}</Text></TouchableOpacity>); })}
              </View>
            </View>

            <View style={{ marginTop:16 }}>
              <Text style={{ fontWeight:"700", marginBottom:8 }}>Цена (пример: 35000)</Text>
              <View style={{ flexDirection:"row" }}>
                <TextInput placeholder="Мин" keyboardType="number-pad" value={minP} onChangeText={setMinP} style={[styles.input, { marginRight:8 }]} />
                <TextInput placeholder="Макс" keyboardType="number-pad" value={maxP} onChangeText={setMaxP} style={styles.input} />
              </View>
            </View>

            <View style={{ marginTop:16 }}>
              <Text style={{ fontWeight:"700", marginBottom:8 }}>Минимальный рейтинг</Text>
              <TextInput placeholder="Например 3.5" keyboardType="decimal-pad" value={minR} onChangeText={setMinR} style={styles.input} />
            </View>

            <View style={{ height:20 }} />
            <View style={{ flexDirection:"row", justifyContent:"space-between" }}>
              <TouchableOpacity style={[styles.btnPrimary, { flex:1, marginRight:8 }]} onPress={()=> { setFilterCities(selCities); setFilterTypes(selTypes); setMinPrice(minP); setMaxPrice(maxP); setMinRating(minR ? Number(minR) : 0); applyFilters(); }}><Text style={{ color:"#fff", fontWeight:"800" }}>Применить</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.btnSecondary, { flex:1 }]} onPress={()=> { setSelCities([]); setSelTypes([]); setMinP(""); setMaxP(""); setMinR(""); resetFilters(); }}><Text style={{ fontWeight:"800" }}>Сбросить</Text></TouchableOpacity>
            </View>
            <View style={{ height:120 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <LinearGradient colors={[THEME.bgTop, THEME.bgMid, THEME.bgBottom]} style={styles.app}>
      <SafeAreaView style={{ flex:1 }}>
        <View style={{ flex:1 }}>
          { tab === "home" && <HomeScreen /> }
          { tab === "search" && <SearchScreen /> }
          { tab === "fav" && <FavoritesScreen /> }
          { tab === "profile" && <ProfileScreen /> }
        </View>

        { articleOpen && <ArticleDetail article={articleOpen} /> }
        { selectedCenter && <CenterDetail center={selectedCenter} /> }
        <FiltersModal />
        <RequestModal visible={requestModalVisible} onClose={()=> { setRequestModalVisible(false); setCurrentRequestCenter(null); }} center={currentRequestCenter} />

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={()=> setTab("home")}><Text style={{ color: tab==="home" ? THEME.primary : THEME.muted }}>Главная</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={()=> setTab("search")}><Text style={{ color: tab==="search" ? THEME.primary : THEME.muted }}>Поиск</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={()=> setTab("fav")}><Text style={{ color: tab==="fav" ? THEME.primary : THEME.muted }}>Избранное</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={()=> setTab("profile")}><Text style={{ color: tab==="profile" ? THEME.primary : THEME.muted }}>Профиль</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  app: { flex:1 },
  rebaTitle: { fontSize: 36, fontWeight:"900", color:"#023245", letterSpacing:1 },
  shimmerOverlay: { position:"absolute", top:0, left: (SCREEN_W/2)-100, width:200, height:44, borderRadius:8, overflow:"hidden" },
  rebaSubtitle: { color: THEME.muted, marginTop:6, fontWeight:"700" },
  heroSearchSmall: { marginTop:10, backgroundColor:"#fff", padding:12, borderRadius:12, width: Math.min(640, SCREEN_W - 48), ...THEME.shadow },
  searchInput: { backgroundColor:"#fff", padding:10, borderRadius:12, ...THEME.shadow },
  card: { flexDirection:"row", backgroundColor: THEME.card, borderRadius:16, padding:12, minHeight:180, alignItems:"flex-start", ...THEME.shadow },
  cardImageWrap: { width:112, height:100, borderRadius:12, overflow:"hidden", backgroundColor:"#eef8ff", alignItems:"center", justifyContent:"center" },
  cardImage: { width:124, height:116, borderRadius:10 },
  cardContent: { flex:1, paddingLeft:12, paddingRight:6 },
  cardTitle: { fontWeight:"600", fontSize:15, lineHeight:20 }, // reduced weight per request
  typesText: { marginTop:8, fontWeight:"700", color: THEME.primary, fontSize:14 },
  cityPill: { backgroundColor: THEME.pillBg, paddingHorizontal:8, paddingVertical:5, borderRadius:8 },
  cityPillText: { color: THEME.primary, fontWeight:"800", fontSize:12 },
  cardBlurb: { color: THEME.muted, marginTop:8, fontSize:13 },
  cardBottomRow: { marginTop:10, flexDirection:"row", justifyContent:"space-between", alignItems:"center" },
  price: { fontWeight:"900", color: THEME.primary },
  ratingText: { fontWeight:"800" },
  articleCard: { backgroundColor:"#fff", borderRadius:12, overflow:"hidden", ...THEME.shadow },
  articleImage: { width: "100%", height:150 },
  detailOverlay: { position:"absolute", top:0, left:0, right:0, bottom:0, backgroundColor: THEME.card, zIndex:70 },
  detailHeader: { padding:12, flexDirection:"row", alignItems:"center", borderBottomWidth:1, borderColor:"#f0f4fb" },
  backCircle: { width:44, height:44, borderRadius:10, backgroundColor:"#fff", alignItems:"center", justifyContent:"center", marginRight:8 },
  dotsContainer: { position:"absolute", bottom:12, left:0, right:0, alignItems:"center", justifyContent:"center", flexDirection:"row" },
  dot: { width:8, height:8, borderRadius:4, backgroundColor:"rgba(255,255,255,0.6)", margin:4 },
  dotActive: { backgroundColor: THEME.primary, width:10, height:10 },
  mapButton: { marginTop:10, padding:12, borderRadius:10, borderWidth:1, borderColor:"#eef7ff", alignItems:"center" },
  typePill: { backgroundColor:"#e8f7ff", paddingHorizontal:8, paddingVertical:6, borderRadius:8, marginRight:8, marginTop:6 },
  typePillText: { color:"#063a9b", fontWeight:"700", fontSize:12 },
  featurePill: { backgroundColor:"#e8f7ff", padding:8, borderRadius:8, marginRight:8, marginTop:6 },
  review: { marginTop:8, padding:10, borderRadius:10, backgroundColor:"#fbfeff", borderWidth:1, borderColor:"#eef7ff" },
  detailFooter: { padding:10, flexDirection:"row", alignItems:"center", borderTopWidth:1, borderColor:"#f0f4fb", backgroundColor:"#fff" },
  footerBtnPrimary: { flex:1, minWidth:0, padding:14, backgroundColor: THEME.primary, borderRadius:12, marginRight:8, alignItems:"center" },
  btnPrimary: { backgroundColor: THEME.primary, padding:12, borderRadius:10, alignItems:"center" },
  btnSecondary: { padding:12, borderRadius:10, alignItems:"center", borderWidth:1, borderColor:"#dfefff", backgroundColor:"#fff" },
  bottomNav: { height:70, margin:12, backgroundColor:"#fff", borderRadius:16, flexDirection:"row", justifyContent:"space-around", alignItems:"center", ...THEME.shadow },
  navItem: { alignItems:"center" },
  profileBtn: { padding:14, backgroundColor:"#fff", borderRadius:12, ...THEME.shadow, marginBottom:8 },
  profileLink: { padding:12, backgroundColor:"#fff", borderRadius:10, marginTop:8, ...THEME.shadow },
  filterPillTop: { paddingHorizontal:12, paddingVertical:10, borderRadius:12, marginLeft:10, backgroundColor:"#fff", borderWidth:1, borderColor:"#eef7ff" },
  filterChip: { paddingVertical:8, paddingHorizontal:10, borderRadius:10, backgroundColor:"#fff", borderWidth:1, borderColor:"#eef7ff", marginRight:8, marginBottom:8 },
  filterChipActive: { backgroundColor: THEME.primary, borderColor: THEME.primary },
  filterChipText: { fontWeight:"700" },
  input: { backgroundColor:"#fff", padding:10, borderRadius:10, borderWidth:1, borderColor:"#eef7ff" }
});