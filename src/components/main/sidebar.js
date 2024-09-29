import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles.css';
import { Row, Col, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const SideBarComponent = ({token, socket, sidebarOpen, spanDisplay, handleViewSidebar, logoutTrigger, loading, setLoading, importContact, importProfile, importRequests, importArchive}) => {
    const navigate = useNavigate();
    const renderTooltip = (props) => (
      <Tooltip id="button-tooltip" {...props}>
        {props}
      </Tooltip>
    );
    const sidebarClass = sidebarOpen ? "open sidebar rounded" : "sidebar rounded";
    return (
        <>
        <div className={sidebarClass}>
            <OverlayTrigger placement="right" delay={{ show:250, hide: 250 }} overlay={renderTooltip('Profile')}>
                <Button onClick={()=>{navigate(`/${token}/profile`)}} variant="outline-light" className="w-100 h-100 px-3 py-3" style={{border:'none'}} data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Icon-only">
                    <Row>
                        <Col md="auto">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                            </svg>
                        </Col>
                        <Col md="auto">
                            <span class="list-item" id="list-item" style={{display: spanDisplay}}>
                                Profile
                            </span>
                        </Col>
                    </Row>
                </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="right" delay={{ show:250, hide: 250 }} overlay={renderTooltip('Search')}>
                <Button onClick={()=>{navigate('/search')}} variant="outline-light" className="w-100 h-100 px-3 py-3" style={{border:'none'}} data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Icon-only">
                    <Row>
                        <Col md="auto">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                            </svg>
                        </Col>
                        <Col md="auto">
                            <span class="list-item" id="list-item" style={{display: spanDisplay}}>
                                Search 
                            </span>
                        </Col>
                    </Row>
                </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="right" delay={{ show:250, hide: 250 }} overlay={renderTooltip('Messages')}>
                <Button onClick={()=>{navigate(`/${token}/messages`)}} variant="outline-light" className="w-100 h-100 px-3 py-3" style={{border:'none'}} data-bs-toggle="tooltip" data-bs-placement="right" aria-label="Dashboard" data-bs-original-title="Dashboard">
                    <Row>
                        <Col md="auto">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-chat-left-dots" viewBox="0 0 16 16">
                                <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                                <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                            </svg>
                        </Col>
                        <Col md="auto">
                            <span class="list-item" style={{display: spanDisplay}}>
                                Messages
                            </span>
                        </Col>
                    </Row>
                </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="right" delay={{ show:250, hide: 250 }} overlay={renderTooltip('Requests')}>
                <Button onClick={()=>{navigate(`/${token}/requests`)}} variant="outline-light" className="w-100 h-100 px-3 py-3" style={{border:'none'}} data-bs-toggle="tooltip" data-bs-placement="right" aria-label="Orders" data-bs-original-title="Orders">
                    <Row>
                        <Col md="auto">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person-plus" viewBox="0 0 16 16">
                                <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                                <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"/>
                            </svg>
                        </Col>
                        <Col md="auto">
                            <span class="list-item" style={{display: spanDisplay}}>
                                Requests
                            </span>
                        </Col>
                    </Row>
                </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="right" delay={{ show:250, hide: 250 }} overlay={renderTooltip('Archived')}>
                <Button onClick={()=>{navigate(`/${token}/archive`)}} variant="outline-light" className="w-100 h-100 px-3 py-3" style={{border:'none'}} data-bs-toggle="tooltip" data-bs-placement="right" aria-label="Products" data-bs-original-title="Products">
                    <Row>
                        <Col md="auto">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-incognito" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="m4.736 1.968-.892 3.269-.014.058C2.113 5.568 1 6.006 1 6.5 1 7.328 4.134 8 8 8s7-.672 7-1.5c0-.494-1.113-.932-2.83-1.205l-.014-.058-.892-3.27c-.146-.533-.698-.849-1.239-.734C9.411 1.363 8.62 1.5 8 1.5s-1.411-.136-2.025-.267c-.541-.115-1.093.2-1.239.735m.015 3.867a.25.25 0 0 1 .274-.224c.9.092 1.91.143 2.975.143a30 30 0 0 0 2.975-.143.25.25 0 0 1 .05.498c-.918.093-1.944.145-3.025.145s-2.107-.052-3.025-.145a.25.25 0 0 1-.224-.274M3.5 10h2a.5.5 0 0 1 .5.5v1a1.5 1.5 0 0 1-3 0v-1a.5.5 0 0 1 .5-.5m-1.5.5q.001-.264.085-.5H2a.5.5 0 0 1 0-1h3.5a1.5 1.5 0 0 1 1.488 1.312 3.5 3.5 0 0 1 2.024 0A1.5 1.5 0 0 1 10.5 9H14a.5.5 0 0 1 0 1h-.085q.084.236.085.5v1a2.5 2.5 0 0 1-5 0v-.14l-.21-.07a2.5 2.5 0 0 0-1.58 0l-.21.07v.14a2.5 2.5 0 0 1-5 0zm8.5-.5h2a.5.5 0 0 1 .5.5v1a1.5 1.5 0 0 1-3 0v-1a.5.5 0 0 1 .5-.5"/>
                            </svg>
                        </Col>
                        <Col md="auto">
                            <span class="list-item" style={{display: spanDisplay}}>
                                Archived
                            </span>
                        </Col>
                    </Row>
                </Button>
            </OverlayTrigger>
            <hr class='mx-2 sidebar-padding' style={{color: "white"}}></hr>
            <OverlayTrigger placement="right" delay={{ show:250, hide: 250 }} overlay={renderTooltip('Log-out')}>
                <Button onClick={()=>{logoutTrigger()}} variant="outline-light" className="w-100 h-100 px-3 py-3" style={{border:'none'}} data-bs-toggle="tooltip" data-bs-placement="right" aria-label="Products" data-bs-original-title="Products">
                    <Row>
                        <Col md="auto">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-power" viewBox="0 0 16 16">
                                <path d="M7.5 1v7h1V1z"/>
                                <path d="M3 8.812a5 5 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812"/>
                            </svg>
                        </Col>
                        <Col md="auto">
                            <span class="list-item" style={{display: spanDisplay}}>
                                Log-out
                            </span>
                        </Col>
                    </Row>
                </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="right" delay={{ show:250, hide: 250 }} overlay={renderTooltip('Expand')}>
                <Button onClick={handleViewSidebar} variant="outline-light" className="w-100 h-100 px-3 py-3" style={{border:'none'}} data-bs-toggle="tooltip" data-bs-placement="right" aria-label="Products" data-bs-original-title="Products">
                    <Row>
                        <Col md="auto">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-caret-right" viewBox="0 0 16 16">
                                <path d="M6 12.796V3.204L11.481 8zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753"/>
                            </svg>
                        </Col>
                        <Col md="auto">
                            <span class="list-item" style={{display: spanDisplay}}>
                                Expand
                            </span>
                        </Col>
                    </Row>
                </Button>
            </OverlayTrigger>
        </div>
        </>
    );
}
export default SideBarComponent