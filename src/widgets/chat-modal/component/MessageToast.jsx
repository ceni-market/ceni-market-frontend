import { useEffect, useState } from 'react'

function MessageToast( messageToast, setMessageToast, isBottom ) {

    if(isBottom && messageToast) {
        setMessageToast(false);
    }

    return (
        <div>새로운 메시지가 도착했습니다.</div>
    )
}

export default MessageToast;