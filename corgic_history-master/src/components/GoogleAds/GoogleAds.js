import React, { useEffect } from 'react';

const GoogleAds = (props) =>  {

    useEffect (()=> {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    },[])

    return (
        <ins className='adsbygoogle'
            style={{ display: 'block' }}
            data-ad-client='ca-pub-1755843578653678'
            data-ad-slot='1755843578653678'
            data-ad-format='auto'
            data-full-width-responsive="true"
        >
        </ins>
    );
}

export default GoogleAds;