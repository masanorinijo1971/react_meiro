
import React, { Component } from 'react'
import { Shape, Path } from '@react-native-community/art';

export default  class line {

    constructor(points, color) {
        this.points = points
        this.color = color ? color : '#ffffff'
    }

    setColor(color) {
        this.color = color
    }

    addPoint(point) {
        this.points.push(point)
    }

    render() {

        const path = Path()
        var fstFlg = true
        this.points.forEach(point => {
            if (fstFlg) {
                path.moveTo(point.x, point.y)
                fstFlg = false
            } else {
                path.lineTo(point.x, point.y)
            }
        });

        return (<Shape d={path} fill={this.color} strokeWidth={1} />)

    }

}