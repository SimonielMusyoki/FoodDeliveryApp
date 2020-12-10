import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    Image,
    FlatList,
    Platform,
    Text
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { 
    restaurantData,
    initialCurrentLocation,
    categoryData 
} from '../data/restaurantData'
import { icons, images, SIZES, COLORS, FONTS } from '../constants';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';

const Home = ({navigation}) => {

    const [categories, setCategories] = useState(categoryData);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [restaurants, setRestaurants] = useState(restaurantData)
    const [currentLocation, setCurrentLocation] = useState(initialCurrentLocation)

    function onSelectCategory(category){
        let restaurantsList = restaurantData.filter(a => a.categories.includes(category.id))
        setRestaurants(restaurantsList);
        setSelectedCategory(category);
    }

    function getCategoryNameById(id){
        let category = categories.filter(a => a.id == id);
        if(category.length > 0){
            return category[0].name
        }
        return ""
    }

    function renderHeader(){
        return(
        <View style={{flexDirection:'row', height:50, marginTop: Platform.OS=="android" ? 35 : 0}}>
            <TouchableOpacity
                style={{
                    width: 50,
                    height: "100%",
                    paddingLeft: SIZES.padding * 2,
                    justifyContent: 'center'
                }}            
            >
                <Image 
                    source={icons.nearby}
                    resizeMode="contain"
                    style={{
                        width: 30,
                        height: 30
                    }}
                />

            </TouchableOpacity>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{
                        width: "70%",
                        height: "90%",
                        backgroundColor: COLORS.lightGray3,
                        alignItems: "center",
                        justifyContent: 'center',
                        borderRadius: SIZES.radius
                    }}>
                        <Text style={{ ...FONTS.h3}}>{initialCurrentLocation.streetName}</Text>
                    </View>
            </View>
            <TouchableOpacity style={{
                width: 50,
                height: "100%",
                paddingRight: SIZES.padding * 2,
                justifyContent: "center"
            }}>
                <Image
                    source={icons.location}
                    resizeMode="contain"
                    style={{
                        width: 30,
                        height: 30
                    }}
                />
            </TouchableOpacity>
        </View>
        )
    }

    function renderMainCategories() {
        const renderItem = ({item}) => {
            return(
                <TouchableOpacity
                    style={{
                        marginLeft: SIZES.padding,
                        padding: SIZES.padding,
                        paddingBottom: SIZES.padding*2,
                        backgroundColor: (selectedCategory?.id===item.id ? COLORS.primary : COLORS.white),
                        borderRadius: SIZES.radius,
                        alignItems: "center",
                        justifyContent: "center",
                        ...styles.shadow
                    }}
                    onPress={()=>onSelectCategory(item)}
                >
                    <View style={{
                        backgroundColor:( selectedCategory?.id === item.id ? COLORS.white: COLORS.lightGray),
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        alignItems:'center',
                        justifyContent: "center"
                    }}>
                        <Image 
                        source={item.icon}
                        resizeMode="contain"
                        style={{
                            height:30,
                            width: 30
                        }}
                        />

                    </View>
                    <Text style={{
                        color: ( selectedCategory?.id === item.id ? COLORS.white : COLORS.black),
                        marginTop: SIZES.padding,
                        ...FONTS.body5,
                        fontWeight:"bold"
                    }}>{item.name}</Text>

                </TouchableOpacity>
            )
        }
        return(
            <View style={{ padding: SIZES.padding * 2}}>
                <Text style={{...FONTS.h1}}>Main</Text>
                <Text style={{...FONTS.h1}}>Categories</Text>
                <FlatList
                    data={categories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item=> `${item.id}`}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingVertical: SIZES.padding*2}}

                    />
            </View>
        )
    }

    function renderRestaurantList(){

        const renderItem = ({ item }) => {
            return (
            <TouchableOpacity
                style={{ padding: SIZES.padding*2}}
                onPress = {()=> navigation.navigate('Restaurants', {
                    item,
                    currentLocation
                })}
            >
                <View>
                    <Image
                    source={item.photo}
                    resizeMode="cover"
                    style={{
                        width: "100%",
                        height: 200,
                        borderRadius: SIZES.radius
                    }}
                     />

                     <View style={{
                         position: "absolute",
                         bottom: 0,
                         height: 50,
                         width: SIZES.width*0.3,
                         backgroundColor: COLORS.white,
                         borderTopRightRadius: SIZES.radius,
                         borderBottomLeftRadius: SIZES.radius,
                         alignItems: "center",
                         justifyContent: 'center',
                         ...styles.shadow
                     }}>
                         <Text style={{...FONTS.h4}}>{item.duration}</Text>
                     </View>
                </View>

                {/* Restaurant Info */}
                    <Text style={{...FONTS.body2}}>{item.name}</Text>
                    <View style={{
                        flexDirection:'row',
                        marginTop: SIZES.padding,
                    }}>
                        <Image 
                            source={icons.star}
                            resizeMode="contain"
                            style={{
                                height: 20,
                                width: 20,
                                tintColor: COLORS.primary,
                                marginRight: 10
                            }}

                        />
                        <Text style={{...FONTS.body3}}>{item.rating}</Text>
                        {/* Categories */}
                        <View style={{
                            flexDirection: 'row',
                            marginLeft: 10,
                        }}>
                            {
                                item.categories.map((categoryId) => {
                                    return (
                                        <View                                        
                                            key={categoryId}
                                            style={{
                                                flexDirection: 'row',
                                                
                                            }}
                                        >
                                            <Text style={{...FONTS.body3, }}>{getCategoryNameById(categoryId)}</Text>
                                            <Text style={{...FONTS.h3,color: COLORS.darkgray }}> . </Text>

                                            
                                        </View>
                                    )
                                })
                            }
                            {/* Price */}
                            {
                                [1,2,3].map((priceRating) => {
                                    return(
                                        <Text
                                            key={priceRating}
                                            style={{
                                            ...FONTS.h3,
                                            color: ( priceRating <= item.priceRating) ? COLORS.black : COLORS.darkgray  
                                            }}
                                        >
                                            $
                                        </Text>
                                    )
                                })
                            }
                        </View>
                    </View>
            </TouchableOpacity>
            )
        }

        return (
            <FlatList
                data={restaurants}
                keyExtractor={item => `${item.id}`}
                renderItem={renderItem}
                contentContainerStyle = {{
                    paddingHorizontal: SIZES.padding*2,
                    paddingBottom: 30,
                }}
            />
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            { renderHeader() }
            { renderMainCategories() }
            { renderRestaurantList() }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGray4
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    }
})
export default Home;