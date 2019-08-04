import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';

import {fetchDestinationsIfNeeded, fetchQueueJobsIfNeeded} from '../actions';
import {jobHasFailed, jobStatus} from '../tepid-utils';
import {Modal} from "@material-ui/core";
import useModal from "../hooks/useModal";

function AddTicketDialog(){
	return null
}

function QueueDestinationClicker({dest}){
	const addTicketModal = useModal();
	{
		const iconClass = dest.up ? 'up' : 'down';
		const iconText = dest.up ? 'arrow_upward' : 'arrow_downward';
		return (
			<React.Fragment>
			<div key={dest._id} onClick={addTicketModal.handleOpen}>
				<i className={`material-icons ${iconClass}`}>{iconText}</i> {dest.name}
			</div>
			<Modal open={addTicketModal.open} onClose={addTicketModal.handleClose}>
				<AddTicketDialog/>
			</Modal>
			</React.Fragment>
		);
	}
}

function DashboardPrinter({queue, destinations,loadingDestinations, jobs, queueJobs, loadingQueueJobs, fetchNeededData}) {

	useEffect(() => {
		fetchNeededData()
	});

	if (loadingDestinations) return (<div className="col"></div>);

	const queueDestinations = queue.destinations
		.map(dest => destinations[dest])
		.sort((d1, d2) => d1.name.localeCompare(d2));

	const queueDestinationClickers = queueDestinations.map(dest => <QueueDestinationClicker dest={dest}/> );

	const jobsToShow = queueJobs.slice(0, 25).map(it => jobs.items[it]);
	const queueJobsElement = loadingQueueJobs
		? (<tr style={{borderBottom: 'none'}}>
			<td colSpan="4" style={{textAlign: 'center'}}>Loading...</td>
		</tr>)
		: jobsToShow.map(job => (
			<tr key={job._id} className={jobHasFailed(job) ? 'failed' : ''}>
				<td><Link to={`/accounts/${job.userIdentification}`}>{job.userIdentification}</Link></td>
				<td>{destinations[job.destination]
					? destinations[job.destination].name
					: ''}</td>
				<td>{jobStatus(job)}</td>
				<td><i className="material-icons">more_vert</i></td>
			</tr>
		));

	return (
		<div className="col dash-printer no-side-padding no-bottom-padding">
			<div className="printer-status-display">
				<i className="material-icons">print</i>
				<i className="material-icons">print</i>
			</div>
			<h2>{queue.name}</h2>
			<div className="printer-status">{queueDestinationClickers}</div>
			<table className="dash-printer-queue">
				<thead>
				<tr>
					<th style={{width: '5.8rem'}}>User</th>
					<th style={{width: '5.8rem'}}>Printer</th>
					<th style={{minWidth: '12.3rem'}}>Status</th>
					<th style={{width: '2.9rem'}}>&nbsp;</th>
				</tr>
				</thead>
				<tbody>{queueJobsElement}</tbody>
			</table>
		</div>
	);
}

const mapStateToProps = (state, ownProps) => {
	const loading = state.queues.jobsByQueue[ownProps.queue.name].isFetching || state.destinations.isFetching;
	const unloaded = state.queues.jobsByQueue[ownProps.queue.name].items.length === 0;

	const loadingDestinations = Object.keys(state.destinations.items).length === 0;

	return {
		queue: ownProps.queue,
		queueJobs: state.queues.jobsByQueue[ownProps.queue.name].items,
		destinations: state.destinations.items,
		loading: unloaded || loading || loadingDestinations,
		loadingDestinations: loadingDestinations,
		loadingQueueJobs: unloaded || loading,
		jobs: state.jobs
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		fetchNeededData: () => {
			dispatch(fetchDestinationsIfNeeded()).then(() => dispatch(fetchQueueJobsIfNeeded(ownProps.queue.name)));
		}
	};
};

const DashboardPrinterContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(DashboardPrinter));

export default DashboardPrinterContainer;
