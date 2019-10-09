import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Foundation from 'react-native-vector-icons/Foundation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import Zocial from 'react-native-vector-icons/Zocial'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'

export default class VIcon extends Component {

    static TYPE_ANTDESIGN = 'AntDesign';
    static TYPE_ENTYPO = 'Entypo';
    static TYPE_EVILICONS = 'EvilIcons';
    static TYPE_FEATHER = 'Feather';
    static TYPE_FONTAWESOME = 'FontAwesome';
    static TYPE_FOUNDATION = 'Foundation';
    static TYPE_IONICONS = 'Ionicons';
    static TYPE_MATERIALCOMMUNITYICONS = 'MaterialCommunityIcons';
    static TYPE_MATERIALICONS = 'MaterialIcons';
    static TYPE_OCTICONS = 'Octicons';
    static TYPE_ZOCIAL = 'Zocial';
    static TYPE_SIMPLELINEICONS = 'SimpleLineIcons';

    static defaultProps = {
        type: this.TYPE_ENTYPO,
        size: 12,
        color: '#666',
        name: 'mobile',
        style: {},
    }

    render() {
        switch (this.props.type) {
            default:
                this.icon = (<Entypo name={this.props.name} size={this.props.size} color={this.props.color} style={this.props.style} />);
                break;
            case VIcon.TYPE_ANTDESIGN:
                this.icon = (<AntDesign name={this.props.name} size={this.props.size} color={this.props.color} style={this.props.style} />);
                break;
            case VIcon.TYPE_EVILICONS:
                this.icon = (<EvilIcons name={this.props.name} size={this.props.size} color={this.props.color} style={this.props.style} />);
                break;
            case VIcon.TYPE_FEATHER:
                this.icon = (<Feather name={this.props.name} size={this.props.size} color={this.props.color} style={this.props.style} />);
                break;
            case VIcon.TYPE_FONTAWESOME:
                this.icon = (<FontAwesome name={this.props.name} size={this.props.size} color={this.props.color} style={this.props.style} />);
                break;
            case VIcon.TYPE_FOUNDATION:
                this.icon = (<Foundation name={this.props.name} size={this.props.size} color={this.props.color} style={this.props.style} />);
                break;
            case VIcon.TYPE_IONICONS:
                this.icon = (<Ionicons name={this.props.name} size={this.props.size} color={this.props.color} style={this.props.style} />);
                break;
            case VIcon.TYPE_MATERIALCOMMUNITYICONS:
                this.icon = (<MaterialCommunityIcons name={this.props.name} size={this.props.size} color={this.props.color} style={this.props.style} />);
                break;
            case VIcon.TYPE_MATERIALICONS:
                this.icon = (<MaterialIcons name={this.props.name} size={this.props.size} color={this.props.color} style={this.props.style} />);
                break;
            case VIcon.TYPE_OCTICONS:
                this.icon = (<Octicons name={this.props.name} size={this.props.size} color={this.props.color} style={this.props.style} />);
                break;
            case VIcon.TYPE_ZOCIAL:
                this.icon = (<Zocial name={this.props.name} size={this.props.size} color={this.props.color} style={this.props.style} />);
                break;
            case VIcon.TYPE_SIMPLELINEICONS:
                this.icon = (<SimpleLineIcons name={this.props.name} size={this.props.size} color={this.props.color} style={this.props.style} />);
                break;
        }
        if (this.props.onPress == null) {
            return this.icon;
        } else {
            return <TouchableOpacity onPress={this.props.onPress} activeOpacity={0.6} style={[this.props.containerStyle]}>{this.icon}</TouchableOpacity>
        }
    }
}