import { ChangeEvent, Fragment, useEffect, useState } from 'react'
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import clsx from 'clsx';
import { FaCheck } from 'react-icons/fa';
import { CalendarDate, Chip,  Textarea } from '@nextui-org/react';
import { useFetcher } from '@remix-run/react';
import { loader } from '~/routes/_app+/agents/autocomplete/_index';


interface Props {
    routeId: number,
    assignAt: CalendarDate
}

export function AutocompleteMultiple({ routeId, assignAt }: Props) {
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [query, setQuery] = useState('');
  const { submit, data, state } = useFetcher<typeof loader>({ key: 'getAgents' });
  
  const fetcherSelected = useFetcher({ key: `getAgents_${routeId}` } );

    useEffect(() => {

        if(routeId === 0) {
            setSelectedPeople([]);
            return;
        }

        fetcherSelected.submit({ 
            routeId, assignAt: 
            assignAt.toString() 
        }, {
            action: '/agents/selected'
        });

    }, [routeId, assignAt]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {

        submit({ 
            data: event.target.value,
            assignAt: assignAt.toString() 
        }, {
            action: '/agents/autocomplete'
        });

        setQuery(event.target.value)
    }

    useEffect(() => {

        if(
            fetcherSelected.state === 'idle'
            && Array.isArray(fetcherSelected.data)
        ) {
            // setSel   
            const newAgentsSelected = fetcherSelected.data.map(({ user }) => {
                return {...user}
            })

            setSelectedPeople(newAgentsSelected);
        }

    },[fetcherSelected.data, fetcherSelected.state])

    const handleSelected = (a) => {
        
        setSelectedPeople(a);
    }

    const handleDeleteChip = (id: number) => {
        setSelectedPeople(selectedPeople.filter(person => person.id !== id));
        if (selectedPeople.length === 1) {
            setSelectedPeople([]);
        }

    }

    console.log({data})

  return (
    <Combobox 
        name='agents'
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
                isDisabled={routeId === 0}
                onChange={(e) => setQuery(e.target.value)}
                value={query}
                startContent={
                    selectedPeople.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {selectedPeople.map((person) => (
                        <Chip 
                            key={person.id}
                            onClose={() => handleDeleteChip(person.id)}
                        >{person.username}</Chip>
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
                    {
                        data?.agentsRoutes.length > 0
                            && ( <Chip color="warning" variant="bordered">{`Ruta ${data?.agentsRoutes[0].route.name}`}</Chip>)
                    }
                </ComboboxOption>
            ))}
            </ComboboxOptions>
        ): null}
    </Combobox>
  )
}