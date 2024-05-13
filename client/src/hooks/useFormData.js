import {useState} from 'react';

const useFormData = (initialData, action) => {

    const [data, setData] = useState(initialData);

    const handleChange = (e) => {
        setData({
            ...data, [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        try {
            return await action(data);
        } catch (err) {
            console.log(err)
        }
    };

    return {
        data, handleChange, handleSubmit,
    };
};

export default useFormData;
