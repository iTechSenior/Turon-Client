import React from 'react';
import _ from 'lodash';
import { Accordion, Card, Button, Nav, Tab } from 'react-bootstrap';

const tutorsFAQ = [
    {
        question: 'Am I qualified to tutor?',
        answer: 'If you’ve received a favorable grade in your course and feel comfortable teaching others, then you’re qualified to tutor.'
    },
    {
        question: 'What\'s the pay?',
        answer: 'You get to choose your own rate and keep 80% of your earnings from every tutoring session.'
    },
    {
        question: 'What is the time commitment?',
        answer: 'You list your own availability and only tutor when you want to. There is no minimum number of hours you’re required to work.'
    },
    {
        question: 'How and when do I get paid?',
        answer: 'All the money you earn on Turon will be available in your Turon wallet 24 hours after your session is complete. From your wallet, you can immediately send fundsto your Paypal account.'
    },
    {
        question: 'What subjects can I teach?',
        answer: 'You can pick any college level course you’d like and even coding languages.'
    },
    {
        question: 'Why should I book appointments through Turon?',
        answer: `<ol><li>Tutors who book through Turon earn more in the long run than those who don’t. Our search algorithm is designed to reward tutors who stay on our site by giving them more opportunities for new students.</li><li>The money we earn goes directly back into marketing for our tutors to help them get more clients.</li><li>You can only have your hours logged and receive a review by booking your appointments through Turon.</li></ol>`
    },
    {
        question: 'Why can I not book/message a tutor on my account?',
        answer: 'To request a tutoring session, you need to create a student account.'
    },
    {
        question: 'Can I tutor online?',
        answer: 'Yes, you can choose to tutor online or in-person.'
    }
]

const studentsFAQ = [
    {
        question: 'What is Turon?',
        answer: 'Turon helps students find and book appointments with free and private college tutors who can tutor you on your own schedule.'
    },
    {
        question: 'Where does tutoring take place?',
        answer: 'You pick! You can find tutors who can teach you online over Zoom or meet up with you in-person. We recommend meeting in a public place like a coffee shop or a library for in-person meetings.'
    },
    {
        question: 'How much does it cost?',
        answer: 'It depends which tutor you hire. We have several free tutors that can help you as well as private tutors starting at $20/hr!'
    },
    {
        question: 'Why should I book through the site?',
        answer: `<ol><li>Booking through the site ensures payment protection. If anything goes wrong or you are unhappy for any reason with your session, we will issue a full refund.</li><li>You’re able to leave an anonymous review for your tutor. This helps ensure the quality of our community. If a tutor is doing a great job or a poor job, the community would like your feedback!</li></ol>`
    },
    {
        question: 'How do you screen your tutors?',
        answer: '<ol><li>We ask all our tutors only to teach if they have a favorable grade in the class they’re tutoring. If a student is uneasy about a tutor’s proficiency in a course, theymay request the tutor to provide proof of their proficiency through our messaging system. With our messaging system, students can also ask a tutor about their familiarity with specific topics to ensure they are the best tutor for you before youbook an appointment.</li><li>We also have measures in place like our rating and review system to ensure low quality tutors are screened out.</li></ol>'
    },
    {
        question: 'I can’t find a tutor for my class',
        answer: 'Email us at <a href="mailto:support@turon.co">support@turon.co</a> and we’ll find you someone who can help.'
    },
    {
        question: 'What happens if my tutor doesn’t show up?',
        answer: 'Email us at <a href="mailto:support@turon.co">support@turon.co</a> and we will gladly process a refund for you.'
    },
    {
        question: 'What if I’m not satisfied with the tutoring I receive?',
        answer: 'Email us at <a href="mailto:support@turon.co">support@turon.co</a> and we will gladly process a refund for you.'
    },
    {
        question: 'What happens if I want to cancel my appointment?',
        answer: 'We unfortunately have a no-cancellation policy. In order for us to discourage cancellations, we do not process refunds for session cancellations.'
    }
]

export default class FAQ extends React.Component{
    renderStudentFAQ(){
        return (
            <Accordion>
                {
                    _.map(studentsFAQ, (v, i) => (
                        <Card key={i}>
                            <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" className="btn-block" eventKey={i}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h3 className="h6">
                                        {v.question}
                                    </h3>
                                    <div>
                                        <i className="fas fa-angle-down fa-2x"></i>
                                    </div>
                                </div>
                            </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey={i}>
                            <Card.Body className={'text-dark'} dangerouslySetInnerHTML={{__html: v.answer}} />
                            </Accordion.Collapse>
                        </Card>
                    ))
                }
            </Accordion>
        )
    }

    renderTutorFAQ(){
        return (
            <Accordion>
                {
                    _.map(tutorsFAQ, (v, i) => (
                        <Card key={i}>
                            <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" className="btn-block" eventKey={i}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h3 className="h6">
                                        {v.question}
                                    </h3>
                                    <div>
                                        <i className="fas fa-angle-down fa-2x"></i>
                                    </div>
                                </div>
                            </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey={i}>
                            <Card.Body className={'text-dark'} dangerouslySetInnerHTML={{__html: v.answer}} />
                            </Accordion.Collapse>
                        </Card>
                    ))
                }
            </Accordion>
        )
    }

    render(){
        return (
            <div className="container">
                <div className="card shadow">
                    <div className="card-body">
                        <h1 className="h3 text-center text-dark">
                            Got questions? We got answers
                        </h1>

                        <Tab.Container defaultActiveKey="tutors">
                            <Nav variant="pills" className="justify-content-center my-4">
                                <Nav.Item>
                                    <Nav.Link eventKey="tutors">Tutors FAQ</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="students">Students FAQ</Nav.Link>
                                </Nav.Item>
                            </Nav>

                            <Tab.Content>
                                <Tab.Pane eventKey="tutors">
                                    {
                                        this.renderTutorFAQ()
                                    }
                                </Tab.Pane>
                                <Tab.Pane eventKey="students">
                                    {
                                        this.renderStudentFAQ()
                                    }
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                        
                    </div>
                </div>
            </div>
        )
    }
}