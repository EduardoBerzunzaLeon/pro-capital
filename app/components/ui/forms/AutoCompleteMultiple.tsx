import { ChangeEvent, Fragment, useEffect, useState } from 'react'
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import clsx from 'clsx';
import { FaCheck } from 'react-icons/fa';
import { Chip, Input, Spinner, Textarea } from '@nextui-org/react';
import { useFetcher } from '@remix-run/react';
import { loader } from '~/routes/_app+/agents/autocomplete/_index';

const people = [
  { id: 1, name: 'Durward Reynolds' },
  { id: 2, name: 'Kenton Towne' },
  { id: 3, name: 'Therese Wunsch' },
  { id: 4, name: 'Benedict Kessler' },
  { id: 5, name: 'Katelyn Rohan' },
]

export function AutocompleteMultiple() {
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [query, setQuery] = useState('');
  const { submit, data, state } = useFetcher<typeof loader>({ key: 'getAgents' });
  const routeId: number = 1;

    // console.log({data, state})

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {

        submit({ 
            data: event.target.value,
            assignAt: '2024-09-05'  
        }, {
            action: '/agents/autocomplete'
        });

        setQuery(event.target.value)
    }

    useEffect(() => {
        // TODO: do this when switch day or route
        if(state === 'idle' && Array.isArray(data)) {
            const agents = data.reduce((acc, agent) => {
                
                if(agent.agentsRoutes.length === 0) {
                    return acc;
                }
                
                const [{ route }] = agent.agentsRoutes;
                
                console.log(route, routeId);
                if(route.name === routeId ) {
                    console.log({ agent});
                    acc.push({...agent});
                    return acc;
                }
                
                return acc;
            }, []);
            
            console.log({data, agents});
            setSelectedPeople(agents)
        }
    }, [route]);

    const handleSelected = (a) => {
        
        setSelectedPeople(a);
    }

    const handleDeleteChip = (id: number) => {
        setSelectedPeople(selectedPeople.filter(person => person.id !== id));
        if (selectedPeople.length === 1) {
            setSelectedPeople([]);
        }

    }

    console.log({selectedPeople})

  return (
    <Combobox 
        multiple 
        value={selectedPeople} 
        onChange={handleSelected} 
        onClose={() => setQuery('')}
    >
      
      <ComboboxInput 
        aria-label="agents to assign" 
        onChange={handleChange} 
        as={Fragment}
      >
            <Textarea 
                variant='bordered'
                labelPlacement='outside'
                label='Asesores'
                placeholder='selecciona los Asesores'
                onChange={(e) => setQuery(e.target.value)}
                value={query}
                startContent={
                    selectedPeople.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {selectedPeople.map((person) => (
                        <Chip 
                            key={person.id}
                            onClose={() => handleDeleteChip(person.id)}
                        >{person.fullName}</Chip>
                      ))}
                    </div>
                  )}
            />
      </ComboboxInput>
      {(state === 'idle') ?(
            <ComboboxOptions
                anchor="bottom"
                transition
                className={clsx(
                    'capitalize w-[var(--input-width)] rounded-xl border z-50  border-white/5 bg-current p-1 [--anchor-gap:var(--spacing-1)] empty:invisible',
                    'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
                )}
            >
            {data?.map((data) => (
                <ComboboxOption
                    key={data.id}
                    value={data}
                    className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
                >
                    <FaCheck className="invisible size-4 fill-white group-data-[selected]:visible" />
                    <div className="text-sm/6 text-white">{data.fullName}</div>
                </ComboboxOption>
            ))}
            </ComboboxOptions>
        ): null}
    </Combobox>
  )
}