/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, {useEffect, useState} from 'react';

const useMouthCalc = 
  () => {
    let leftLargeValue: string = '17.24vh';
    let topLargeValue: string = '14vh';
    let leftSmallValue: string;
    let topSmallValue: string;
    let width: number = .15;

    let selectedStyle = sessionStorage.getItem('selectedStyle');
    let selectedGender = sessionStorage.getItem('selectedGender');
    if ((selectedStyle == '1' || selectedStyle == '5') && selectedGender == '1') {
        leftLargeValue = '17.1vh';
        topLargeValue = '14.7vh';
        leftSmallValue = '32vw';
        topSmallValue = '56vw';
    } else if (selectedStyle == '4' && selectedGender== '1') {
        width = .2;
        leftLargeValue = '16vh';
        topLargeValue = '14.6vh';
        leftSmallValue = '30.4vw';
        topSmallValue = '55.5vw';
    } else if (selectedStyle == '4' && selectedGender== '2') {
        width = .185;
        leftLargeValue = '16.4vh';
        topLargeValue = '14.4vh';
        leftSmallValue = '30.5vw';
        topSmallValue = '55.3vw'; 
    } else if ((selectedStyle == '1') && selectedGender == '2') {
        leftLargeValue = '16.99vh';
        topLargeValue = '14.4vh';
        leftSmallValue = '32.1vw';
        topSmallValue = '55vw';
    }  else if (( selectedStyle == '5') && selectedGender == '2') {
        width = .14;
        leftLargeValue = '17.3vh';
        topLargeValue = '14.7vh';
        leftSmallValue = '32.4vw';
        topSmallValue = '55.4vw';
    }

    const [mouthLeftLocation, setMouthLeftLocation] = useState(leftLargeValue);
    const [mouthTopLocation, setMouthTopLocation] = useState(topLargeValue);
    const [leftDistance, setLeftDistance] = useState('6vh');
    const [topDistance, setTopDistance] = useState('1vh');
   
    useEffect(() => {
      const calculateWidth = () => {
        const vh = window.innerHeight * 0.01;
        const vw = window.innerWidth * 0.01;

        if (40 * vh > 100 * vw) {
            setMouthLeftLocation(leftSmallValue);
            setMouthTopLocation(topSmallValue)
            setLeftDistance('10vw');
            setTopDistance('28vw');
            
        } else {
            setMouthLeftLocation(leftLargeValue);
            setMouthTopLocation(topLargeValue);
            setLeftDistance('6vh');
            setTopDistance('1vh');
        }
      };

      window.addEventListener('resize', calculateWidth);
      calculateWidth();

      return () => window.removeEventListener('resize', calculateWidth);
    }, [mouthLeftLocation, mouthTopLocation]);

    return {mouthLeftLocation, mouthTopLocation, width, leftDistance, topDistance}
}

export default useMouthCalc;