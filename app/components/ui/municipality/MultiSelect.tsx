
import { useFetcher } from '@remix-run/react';
// import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

  export const MyComponent = () => {

    const fetcher = useFetcher();

    console.log(fetcher.data);
    // const loadOptions = (
    //     inputValue: string,
    //     callback: (options: any) => void
    //   ) => {
    //     console.log(inputValue);
    //     await 
    //     // setTimeout(() => {
    //     //   callback(options);
    //     // }, 1000);
    //   };
    // const loadOptions = (
    //     inputValue: string,
    //     callback: (test: any) => void
    //   ) => {
    //     fetcher.submit({data: inputValue},{ 
    //         action: `/municipality/search`,
    //     });
    //     callback(fetcher?.data?.data)
    //   };

    const handleChange = (a: any) => {
        console.log(a);
        fetcher.submit({data: a},{ 
            action: `/municipality/search`,
        });
    }

      
    return (
        <Select 
            id='municipality-autocomplete' 
            onInputChange={handleChange}
            isLoading={fetcher.state !== 'idle'}
            options={fetcher?.data?.data}
            isMulti
            closeMenuOnSelect={false}
            components={animatedComponents}
            loadingMessage={({ inputValue }) => `Buscando municipios con las letras "${inputValue}"`}
            noOptionsMessage={() => `No opciones`}
        />
    )
  }

//   <Select 
//         closeMenuOnSelect={false}
//         options={options} 
//         isMulti
//         noOptionsMessage={({ inputValue }) => `No registros encontrado para "${inputValue}"`}
//         placeholder='Seleccione el municipio'
//     />