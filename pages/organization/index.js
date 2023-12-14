import { PrimaryCheckbox } from '@/components/Checkbox/Checkbox';
import { FloatingInput } from '@/components/Input/Input';
import { CubeLoader } from '@/components/Loader/Loader';
import { BasicModal } from '@/components/Modal/Modal';
import { OrgGrid } from '@/page-components/Organization/OrgGrid';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

const Index = (props) => {
  const [isPopulating, setIsPopulating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // const [orgs, setOrgs] = useState(null);

  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgDesc, setNewOrgDesc] = useState('');
  const [newOrgNameErr, setNewOrgNameErr] = useState(null);
  const [newOrgDescErr, setNewOrgDescErr] = useState(null);

  const handleSearch = () => {};

  const handleCreateOrganization = async (e) => {
    e.preventDefault();

    if (newOrgName == '') {
      setNewOrgNameErr('Field cannot be empty');
      return;
    }

    const res = await fetch(`/api/organization`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newOrgName,
        orgCode: 'uszth4432',
        createdBy: props?.session?.user?.email,
      }),
    });

    if (!res.ok) {
      console.log('Failed');
    }
  };

  const orgs = [
    {
      name: 'org1',
      member: '22',
      project: '44',
    },
    {
      name: 'org1',
      member: '22',
      project: '44',
    },
    {
      name: 'org1',
      member: '22',
      project: '44',
    },
  ];

  return (
    <div className='w-full'>
      <div className='max-w-6xl mx-4 mt-20 sm:mx-auto'>
        <div className='flex my-2 text-lg font-semibold '>
          Search your Organization &#8595;
        </div>

        <div className='grid grid-cols-1 gap-x-0 gap-y-2 md:gap-2 sm:grid-cols-5 lg:grid-cols-8'>
          <div className='border rounded-md form-control sm:col-span-2 lg:col-span-5 focus-within:border-0'>
            <input
              className='input input-alt'
              placeholder='Organization Code, Name, etc'
              required=''
              type='text'
            />
            <span className='input-border input-border-alt'></span>
          </div>
          <div className='grid grid-cols-5 col-span-3 sm:text-base md:text-lg'>
            <div className='grid col-span-2 my-auto '>
              <button
                onClick={(e) => setIsPopulating(true)}
                className='searchBtn'
              >
                Search
              </button>
            </div>

            <div className='grid col-span-1 my-auto place-content-center'>
              Or
            </div>
            <div className='grid col-span-2 my-auto place-content-stretch'>
              <button
                onClick={(e) => setShowModal(true)}
                className='whitespace-nowrap searchBtn'
              >
                Create New
              </button>
            </div>
          </div>
        </div>
        {isPopulating && (
          <div className='modal-backdrop'>
            <CubeLoader />
          </div>
        )}
        <OrgGrid
          orgs={orgs}
          isHome={false}
          isManageAble={false}
        />
      </div>

      <BasicModal
        shown={showModal}
        header={'Create a new Organization'}
        isUsingBackdrop={false}
        close={() => setShowModal(false)}
      >
        <div className='mt-4 text-slate-700'>
          <p className='text-lg font-semibold text-center'>
            Please fill out the information below
          </p>
          <div className='mb-2 text-lg font-semibold'>Organization Name</div>
          <input
            type='text'
            name='orgName'
            className='input__modal-1 bg-slate-500 '
            placeholder='Organization Name'
            onFocus={() => setNewOrgNameErr(null)}
            onChange={(e) => setNewOrgName(e.target.value)}
          />
          {newOrgNameErr && (
            <div className='text-sm font-semibold tracking-wide text-red-500'>
              {newOrgNameErr}
            </div>
          )}

          <div className='mt-4 mb-2 text-lg font-semibold'>
            Organization Description
          </div>
          <textarea
            rows='8'
            name='orgDesc'
            className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            placeholder='Write the description of this organization here...'
            onFocus={() => setNewOrgDescErr(null)}
            onChange={(e) => setNewOrgDesc(e.target.value)}
          ></textarea>

          <div className='mt-4 '>
            <button
              onClick={handleCreateOrganization}
              className='p-2 text-base font-semibold border-2 border-blue-600 rounded-lg text-slate-800'
            >
              Create Organization
            </button>
          </div>
        </div>
      </BasicModal>
    </div>
  );
};

export default Index;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  // gets orgs limit by 8
  const orgs = await getOrgMainIndex(context);

  return {
    props: {
      session,
    },
  };
}
