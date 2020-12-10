import React from 'react';
import {
    SafeAreaView,
    Platform,
    View, 
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Image,
} from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';

import { icons, COLORS, FONTS, SIZES } from '../constants';

const Restaurants = ({route, navigation}) => {

    const scrollX = new Animated.Value(0);
    const [restaurant, setRestaurant] = React.useState(null);
    const [currentLocation, setCurrentLocation] = React.useState(null);
    const [orderItems, setOrderItems] = React.useState([]);

    React.useEffect(() => {
        let { item, currentLocation } = route.params;
        setRestaurant(item);
        setCurrentLocation(currentLocation)
    })

    function editOrder(action, menuId, price) {
        let orderList = orderItems.slice()
        let item = orderList.filter(a => a.menuId == menuId)

        if (action == "+") {
            if (item.length > 0) {
                let newQty = item[0].qty + 1
                item[0].qty = newQty
                item[0].total = item[0].qty * price
            } else {
                const newItem = {
                    menuId: menuId,
                    qty: 1,
                    price: price,
                    total: price
                }
                orderList.push(newItem)
            }

            setOrderItems(orderList)
        } else {
            if (item.length > 0) {
                if (item[0]?.qty > 0) {
                    let newQty = item[0].qty - 1
                    item[0].qty = newQty
                    item[0].total = newQty * price
                }
            }

            setOrderItems(orderList)
        }
    }

    function getOrderQuantity(id) {
        let orderItem= orderItems.filter(item => item.menuId == id)
        if(orderItem.length > 0){
            return orderItem[0].qty
        }else{
            return 0;
        }
    }

    function getBasketItemCount() {
        let itemCount = orderItems.reduce((a, b) => a + (b.qty || 0), 0);
        return itemCount;
    }

    function sumOrder(){
        let total = orderItems.reduce((a, b)=> a + (b.qty * b.price || 0),0)
        return total.toFixed(2);
    }

    function renderHeader(){
        return (
            <View style={{
                flexDirection:'row',
                marginTop: (Platform.OS =="android" ? 30 : 0)
            }}>
                <TouchableOpacity
                    style={{
                        paddingLeft: SIZES.padding*2,
                        width: 50,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    onPress={() => navigation.goBack()}
                >
                    <Image
                        source ={icons.back}
                        resizeMode="contain"
                        style={{
                            width: 30,
                            height: 30,
                            justifyContent: "center"
                        }}
                    />
                </TouchableOpacity>

                {/* Restaurant Name Section */}
                <View style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <View style={{
                        height: 50,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: SIZES.padding*3,
                        borderRadius: SIZES.radius,
                        backgroundColor: COLORS.lightGray3
                    }}>
                        <Text style={{...FONTS.h3}}>{restaurant?.name}</Text>
                    </View>

                </View>

                <TouchableOpacity style={{
                    width: 50,
                    paddingRight: SIZES.padding * 2,
                    justifyContent: "center"
                }}>
                    <Image 
                        source={icons.list}
                        resizeMode="contain"
                        style={{
                            width: 30,
                            height: 30,
                            justifyContent: "center"
                        }}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    function renderFoodInfo(){
        return (
            <Animated.ScrollView
                horizontal
                pagingEnabled
                scrollEventThrottle={16}
                snapToAlignment="center"
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event([
                    { nativeEvent: { contentOffset: { x: scrollX } } } 
                ], { useNativeDriver: false })}
            >
                {
                    restaurant?.menu.map((item,index) => (
                        <View
                            key={`menu-${index}`}
                            style={{
                                alignItems: "center"
                            }}
                        
                        >
                            <View style={{ height: SIZES.height *0.35}}>
                                {/* Food Image */}
                                <Image
                                    source={item.photo}
                                    resizeMode="cover"
                                    style={{
                                        width: SIZES.width,
                                        height: "100%"
                                    }}
                                />
                                <View style={{
                                    position: 'absolute',
                                    bottom:-20,
                                    width: SIZES.width,
                                    height: 50,
                                    justifyContent: "center",
                                    flexDirection: 'row'
                                }}>
                                    <TouchableOpacity 
                                    onPress={() => editOrder("-", item.menuId, item.price)}   
                                    style={{
                                        width: 50,
                                        backgroundColor: COLORS.white,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderTopLeftRadius: SIZES.radius,
                                        borderBottomLeftRadius: SIZES.radius
                                    }}>
                                        <Text style={{...FONTS.h1}}>-</Text>
                                    </TouchableOpacity>
                                    <View style={{
                                        justifyContent: "center",
                                        alignItems:"center",
                                        backgroundColor: COLORS.white,
                                        width:50,
                                    }}>
                                        <Text style={{...FONTS.h3}}>{ getOrderQuantity(item.menuId)}</Text>
                                    </View>
                                    <TouchableOpacity 
                                        style={{
                                            width: 50,
                                            borderTopRightRadius: SIZES.radius,
                                            borderBottomRightRadius: SIZES.radius,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: COLORS.white
                                        }}
                                        onPress={() => editOrder("+", item.menuId, item.price)}
                                        >
                                        <Text style={{...FONTS.h1}}>+</Text>
                                    </TouchableOpacity>

                                </View>
                            </View>

                            {/* Name & Description */}
                            <View style={{
                                width: SIZES.width,
                                alignItems: 'center',
                                marginTop: 15,
                                paddingHorizontal: SIZES.padding*2
                            }}>
                                <Text style={{ marginVertical: 10, textAlign: "center",...FONTS.h2}}>{item.name} - {item.price.toFixed(2)}</Text>
                                <Text style={{...FONTS.body3, textAlign:'center'}}>{item.description}</Text>

                            </View>

                            <View style={{
                                flexDirection:'row',
                                marginTop: 10,
                            }}>
                                <Image
                                    source={icons.fire}
                                    resizeMode="contain"
                                    style={{
                                        width: 20,
                                        height: 20,
                                        marginRight:10
                                    }}
                                />
                                <Text style={{...FONTS.body3, color:COLORS.darkgray}}>
                                    {item.calories.toFixed(2)} Cal
                                </Text>
                            </View>
                        </View>
                    ))
                }

            </Animated.ScrollView>
        )
    }
    
    function renderDots() {
        const dotPosition = Animated.divide(scrollX, SIZES.width)

        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: "center",
                    justifyContent: 'center',
                    height: SIZES.padding
                }}
            >
                { 
                restaurant?.menu.map((item,index) => {
                    const opacity = dotPosition.interpolate({
                        inputRange: [index-1, index, index+1],
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: "clamp"
                    });

                    const dotSize = dotPosition.interpolate({
                        inputRange: [index - 1, index, index + 1],
                        outputRange: [ SIZES.base*0.8, 10, SIZES.base*0.8],
                        extrapolate: "clamp"
                    });

                    const dotColor = dotPosition.interpolate({
                        inputRange: [index - 1, index, index + 1],
                        outputRange: [COLORS.darkgray, COLORS.primary, COLORS.darkgray],
                        extrapolate: "clamp"
                    });

                    return (
                        <Animated.View
                        key={`dot-${index}`}
                        opacity={opacity}
                        style={{
                            borderRadius: SIZES.radius,
                            marginHorizontal: 6,
                            width: dotSize,
                            height: dotSize,
                            backgroundColor: dotColor
                        }}
                        >

                        </Animated.View>
                    )
                })
                }
            </View>
        )
    }
    function renderOrder(){
        return(
            <View>
                { renderDots() }
                <View style={{
                    backgroundColor: COLORS.white,
                    borderTopLeftRadius: 40,
                    borderTopRightRadius: 40,
                }}>
                    <View style={{
                        flexDirection:"row",
                        justifyContent: 'space-between',
                        paddingVertical: SIZES.padding*2, 
                        paddingHorizontal: SIZES.padding *3,
                        borderBottomColor: COLORS.lightGray2,
                        borderBottomWidth: 1
                    }}>
                        <Text style={{...FONTS.h3}}> { getBasketItemCount() } Items in the Cart</Text>
                        <Text style={{...FONTS.h3}}> ${ sumOrder()}</Text>
                    </View>

                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingVertical: SIZES.padding *2,
                        paddingHorizontal: SIZES.padding *3
                    }}>
                        <View style={{
                            flexDirection: "row"
                        }}>
                            <Image 
                                source={icons.pin}
                                resizeMode="contain"
                                style={{
                                    width: 20,
                                    height: 20,
                                    tintColor: COLORS.darkgray
                                }}
                            />
                            <Text style={{ marginLeft: SIZES.padding, ...FONTS.h4}} >{currentLocation?.streetName}</Text>
                        </View>
                        <View style={{ flexDirection: 'row'}}>
                            <Image
                            source={icons.mastercard}
                            resizeMode="contain"
                            style={{
                                width: 20,
                                height: 20,
                                tintColor: COLORS.darkgray
                            }}
                             />
                            <Text style={{ marginLeft: SIZES.padding, ...FONTS.h4}} >8888</Text>
                        </View>
                    </View>

                    {/* Order Button */}
                    <View style={{
                        padding: SIZES.padding * 2,
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <TouchableOpacity
                            style= {{
                                width: SIZES.width*0.9,
                                padding: SIZES.padding,
                                backgroundColor: COLORS.primary,
                                alignItems: 'center',
                                borderRadius: SIZES.radius
                            }}
                            onPress = {() => navigation.navigate("OrderDelivery", {
                                restaurant: restaurant,
                                currentLocation: currentLocation
                            })}
                        >
                            <Text style={{ color: COLORS.white,...FONTS.h2}}>Order</Text>

                        </TouchableOpacity>
                    </View>
                </View>

                {
                    isIphoneX() && 
                    <View
                        style={{
                            position: "absolute",
                            bottom: -34,
                            left: 0,
                            right: 0,
                            height: 34,
                            backgroundColor: COLORS.white
                        }}></View>
                }
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            { renderHeader() }
            { renderFoodInfo() }
            { renderOrder() }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGray2
    }
})
export default Restaurants;