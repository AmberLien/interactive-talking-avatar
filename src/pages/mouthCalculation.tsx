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
    let width: number = .14;

    let selectedStyle = sessionStorage.getItem('selectedStyle');
    let selectedGender = sessionStorage.getItem('selectedGender');
    if ((selectedStyle == '1' || selectedStyle == '5') && selectedGender == '1') {
        leftLargeValue = '17.24vh';
        topLargeValue = '14vh';
        leftSmallValue = '34.6vw';
        topSmallValue = '28vw';
    } else if (selectedStyle == '4' && selectedGender== '1') {
        width = .2;
        leftLargeValue = '16vh';
        topLargeValue = '13.66vh';
        leftSmallValue = '32.3vw';
        topSmallValue = '27.5vw';
    } else if (selectedStyle == '4' && selectedGender== '2') {
        width = .19;
        leftLargeValue = '16.25vh';
        topLargeValue = '13.3vh';
        leftSmallValue = '32.3vw';
        topSmallValue = '26.9vw'; 
    } else if ((selectedStyle == '1') && selectedGender == '2') {
        width = .13;
        leftLargeValue = '17.46vh';
        topLargeValue = '13.59vh';
        leftSmallValue = '34.8vw';
        topSmallValue = '27.3vw';
    }  else if (( selectedStyle == '5') && selectedGender == '2') {
        width = .13;
        leftLargeValue = '17.46vh';
        topLargeValue = '13.8vh';
        leftSmallValue = '34.8vw';
        topSmallValue = '27.4vw';
    }

    const [mouthLeftLocation, setMouthLeftLocation] = useState(leftLargeValue);
    const [mouthTopLocation, setMouthTopLocation] = useState(topLargeValue);
   
    useEffect(() => {
      const calculateWidth = () => {
        const vh = window.innerHeight * 0.01;
        const vw = window.innerWidth * 0.01;

        if (40 * vh > 100 * vw) {
            setMouthLeftLocation(leftSmallValue);
            setMouthTopLocation(topSmallValue)
            
        } else {
            setMouthLeftLocation(leftLargeValue);
            setMouthTopLocation(topLargeValue);
        }
      };

      window.addEventListener('resize', calculateWidth);
      calculateWidth();

      return () => window.removeEventListener('resize', calculateWidth);
    }, [mouthLeftLocation, mouthTopLocation]);

    return {mouthLeftLocation, mouthTopLocation, width}
}

export default useMouthCalc;