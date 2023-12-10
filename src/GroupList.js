import React, {useEffect, useState} from "react";
import { Button, ButtonGroup, Container, Table } from "react-bootstrap";
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { useCookies } from "react-cookie";

const GroupList = () => {

    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cookies] = useCookies(['XSRF-TOKEN']);

    useEffect(() => {
        setLoading(true);

        fetch('api/groups').then(response => response.json()).then(data => {
            setGroups(data);
            setLoading(false);
        })
    }, []);

    const remove = async (id) => {
        await fetch(`/api/group/${id}`, {
            method: 'DELETE',
            headers: {
                'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }).then(() => {
            let updatedGroups = [...groups].filter(i => i.id !== id);
            setGroups(updatedGroups);
        });
    }

    if(loading) { 
        return <p>Loading...</p>
    }

    const groupList = groups.map(group => {
        const address = `${group.address || ''} ${group.city || ''} ${group.stateOrProvidence || ''}`;

        return <tr key={group.id}>
      <td style={{whiteSpace: 'nowrap'}}>{group.name}</td>
      <td>{address}</td>
      <td>{group.events.map(event => {
        return <div key={event.id}>{new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'long',
          day: '2-digit'
        }).format(new Date(event.date))}: {event.title}</div>
      })}</td>
      <td>
        <ButtonGroup>
          <Link to={"/groups/" + group.id}><Button size="sm" color="primary">Edit</Button></Link>
          <Button size="sm" color="danger" onClick={() => remove(group.id)}>Delete</Button>
        </ButtonGroup>
      </td>
    </tr>
  });

  return (
    <div>
      <AppNavbar/>
      <Container fluid>
        <div className="float-end">
        <Link to="/groups/new"><Button color="success">Add Group</Button></Link>
        </div>
        <h3>My JUG Tour</h3>
        <Table className="mt-4">
          <thead>
          <tr>
            <th width="20%">Name</th>
            <th width="20%">Location</th>
            <th>Events</th>
            <th width="10%">Actions</th>
          </tr>
          </thead>
          <tbody>
          {groupList}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default GroupList;