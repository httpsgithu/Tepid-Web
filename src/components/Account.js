import React from 'react';

import JobTable from './JobTable';

class Account extends React.Component {
	componentDidMount() {
		this.props.fetchAccountIfNeeded(this.props.shortUser);
	}

	componentWillReceiveProps(nextProps, nextContext) {
		this.props.fetchAccountIfNeeded(nextProps.shortUser);
	}
	render() {
		if (this.props.account === undefined) {
			return (<div><div className="card">Loading...</div></div>);
		}

		const account = this.props.account.data;

		const facultyOrDepartment = (() => {
			if (!account.staff && account.faculty) {
				return account.faculty;
			} else if(account.staff && account.department) {
				return account.department;
			} else {
				return ''
			}
		})();

		return (
			<div>
				<div className="card no-padding">
					<div className="user-profile">
						<div className="row">
							<div className="col no-padding no-borders">
								<h2>{account.displayName} <div className="badge">CTF Volunteer</div></h2>
							</div>
							<div className="col no-padding no-borders">
								<div className="faculty">{facultyOrDepartment}</div>
							</div>
						</div>
						<div className="flex-row-container">
							<div className="quota-label">Quota</div>
							<div className="quota-bar">
								<div className="quota-inner-bar" style={{width: '69.3%'}}>2772 pages remaining</div>
							</div>
						</div>
						<hr />
						<div className="user-profile-details">
							<div className="row">
								<div className="col">
									<strong>Short Username:</strong> {account.shortUser} <br />
									<strong>Long Username:</strong> {account.longUser} <br />
									<strong>ID:</strong> <a href="">Click to show...</a> <br />
									<strong>Current Status:</strong> Active <br />
									<strong>Student Since:</strong> May 2015 <br />
									User <strong>has</strong> paid into the 21st Century Fund
								</div>
								<div className="col">
									<strong>Preferred Salutation:</strong> <br />
									<input type="text" value="David" style={{marginBottom: '0.6rem'}} /> <br />
									<strong>Jobs Expire After:</strong> 1 Week <br />
									<strong>Colour Printing:</strong> Off
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="card no-padding">
					{/*<JobTable />*/}
				</div>
			</div>
		);
	}
}

export default Account;
