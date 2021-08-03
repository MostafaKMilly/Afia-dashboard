import jwt from 'jsonwebtoken'

function HideForType(props) {
    let token = jwt.verify(localStorage.getItem("token") ,'clinic' )
    let fillterdArr = props.type.filter((type) => type === token.type)
    if (fillterdArr.length !==0) {
        return null
    }
    else {
        return props.children 
    }
}

export default HideForType;