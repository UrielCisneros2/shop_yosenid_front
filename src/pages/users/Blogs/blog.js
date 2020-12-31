import React from 'react'
import BlogList from './services/BlogList'
import ShowBlog from './services/ShowBlog';

import {useParams} from 'react-router-dom'
    
export default function Blog(props) {

    const {location,history} = props;
    const {url} = useParams();



    return(
        <div>
            {url ? (
                <ShowBlog  url={url} />
            ):(
                <BlogList location={location} history={history} />
            )}
        </div>
    )
}
