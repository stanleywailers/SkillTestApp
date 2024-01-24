import React from "react"
import {View, Text} from 'react-native'
import { SocketStock } from "../../model/SocketStock"
import { styles } from "./styles"

type tradeProps = {
    item:SocketStock
}

export const TradItem = ({item }:tradeProps) => {
    console.log(item.symbol,'item')
    return(
      
    <View style={styles.content} key={`${item.symbol}-${item.timestamp}`}>
    <Text style={styles.symbolName}>{item.symbol}</Text>
    <Text style={styles.price}>${item.price}</Text>

  
  
  </View>)
}
    
        
    
