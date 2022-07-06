import React, { useState, useEffect } from 'react';
import axios from 'axios';


useEffect(()  =>  {
  async function fetchData()  {
    const result = await axios.get('http://localhost:8888/api/rest/todos',
    {
      headers: { "x-hasura-admin-secret": "secret" }
    }
    )
      console.log(result)
      console.log(result.data)
    }
    fetchData();
    }, []);