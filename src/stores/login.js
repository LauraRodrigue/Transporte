import {defineStore} from 'pinia'
import axios from 'axios'
import {ref} from'vue'
import { useRouter } from 'vue-router';

export const useLoginStore = defineStore('Login', ()=>{
    const token = ref()
    let vendedor = ref([])
    const router = useRouter();

    const Login = async (data) =>{
        try {
        
            let res = await axios.post("/vendedor/vendedor_datos", data);
            vendedor.value = res.data.vendedor
            token.value = res.data.token
            router.push('/home')
            
            return res
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    return{
        token,vendedor,
        Login
    }
})