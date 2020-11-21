import boom from 'boom';
import authenticated from '../../../../utils/auth/authenticatedWrapper';
import { errorHandler } from '../../../../utils/middlewares/errorHandlers';
import scopeValidationHandler from '../../../../utils/middlewares/scopesValidationHandler';
import TeamService from '../../../../services/teams';
import { memberSchema, teamIdSchema } from '../../../../utils/models/team';
import { validationHandler } from '../../../../utils/middlewares/validationHandlers';

export default authenticated(async function (req, res) {
  const { method } = req;
  const teamService = new TeamService();

  if (method === 'GET') {
    const {
      query: { id },
    } = req;
    scopeValidationHandler(['read:teams'], req, res, async function (req, res) {
      try {
        const members = await teamService.getTeamMembersDetails({ id });
        res.status(200).json(members);
      } catch (err) {
        errorHandler(boom.internal(err), req, res);
      }
    });
  } else if (method === 'POST') {
    validationHandler(teamIdSchema, 'query', req, res, function (req, res) {
      validationHandler(memberSchema, 'body', req, res, function (req, res) {
        scopeValidationHandler(['update:teams'], req, res, async function (
          req,
          res
        ) {
          const {
            query: { id },
          } = req;
          try {
            const updatedTeamId = await teamService.addNewMember({
              id,
              member: req.body,
            });
            res.status(200).json(updatedTeamId);
          } catch (err) {
            errorHandler(boom.internal(), req, res);
          }
        });
      });
    });
  } else {
    errorHandler(boom.methodNotAllowed(), req, res);
  }
});