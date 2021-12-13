    //------ CAPTURA FECHA Y HORA -----//
    const timeStamp = () => {
        const today = new Date();
        let date = today.getDate() + '-' + ( today.getMonth() + 1 ) + '-' + today.getFullYear();
        let time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        let dateTime = date + ' ' + time;
        return dateTime
    }

    export default timeStamp() 