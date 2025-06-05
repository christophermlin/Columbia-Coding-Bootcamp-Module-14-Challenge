import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../api/ticketAPI';
import { TicketData } from '../interfaces/TicketData';
import { retrieveUsers } from '../api/userAPI';
import Auth from '../utils/auth'; // Correct import path
import type { UserData } from '../interfaces/UserData';

const CreateTicket = () => {
  const [newTicket, setNewTicket] = useState<TicketData | undefined>(
    {
      id: 0,
      name: '',
      description: '',
      status: 'Todo',
      assignedUserId: 1,
      assignedUser: null
    }
  );

  const navigate = useNavigate();

  useEffect(() => {
    // Set assignedUserId to the logged-in user's id if available
    const profile = Auth.getProfile();
    if (profile && typeof profile === 'object' && 'username' in profile) {
      // If your JWT includes user id, use it. Otherwise, fetch user by username.
      // For now, we'll fetch the user by username from the users list after loading.
      retrieveUsers().then((users: UserData[]) => {
        const user = users.find((u: UserData) => u.username === (profile as any).username);
        if (user) {
          setNewTicket((prev) => prev ? { ...prev, assignedUserId: user.id } : prev);
        }
      });
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newTicket){
      const data = await createTicket(newTicket);
      console.log(data);
      navigate('/');
    }
  }

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTicket((prev) => (prev ? { ...prev, [name]: value } : undefined));
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTicket((prev) => (prev ? { ...prev, [name]: value } : undefined));
  }

  return (
    <div className='container'>
      <form className='form' onSubmit={handleSubmit}>
        <h1>Create Ticket</h1>
        <label htmlFor='tName'>Ticket Name</label>
        <textarea 
          id='tName'
          name='name'
          value={newTicket?.name || ''}
          onChange={handleTextAreaChange}
        />
        <label htmlFor='tStatus'>Ticket Status</label>
        <select 
          name='status' 
          id='tStatus'
          value={newTicket?.status || ''}
          onChange={handleTextChange}
        >
          <option value='Todo'>Todo</option>
          <option value='In Progress'>In Progress</option>
          <option value='Done'>Done</option>
        </select>
        <label htmlFor='tDescription'>Ticket Description</label>
        <textarea 
          id='tDescription'
          name='description'
          value={newTicket?.description || ''}
          onChange={handleTextAreaChange}
        />
        {/* Show assigned user but do not allow changing */}
        <label htmlFor='tUserId'>Submitted By</label>
        <input
          type='text'
          name='assignedUserDisplay'
          value={(() => {
            const profile = Auth.getProfile();
            if (profile && typeof profile === 'object' && 'username' in profile) {
              return (profile as any).username;
            }
            return '';
          })()}
          disabled
        />
        <button type='submit'>Submit Form</button>
      </form>
    </div>
  )
};

export default CreateTicket;
