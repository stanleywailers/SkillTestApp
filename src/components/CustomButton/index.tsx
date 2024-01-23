import React from "react"
import {TouchableOpacity, Text} from 'react-native'
import {styles} from './styles'

type CustomButtonProps= {
    onPress:() => void;
}

export const CustomButton = ({onPress}:CustomButtonProps) => {
    
    return(
     <TouchableOpacity
        onPress={onPress}
     style={styles.button}>
      <Text>Submit</Text>
     </TouchableOpacity>
    )
}