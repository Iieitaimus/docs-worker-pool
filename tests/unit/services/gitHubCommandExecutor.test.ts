import { TestDataProvider } from '../../data/data';
import { GithubCommandExecutor } from '../../../src/services/commandExecutor';
import cp from 'child_process';
jest.mock('child_process');

describe('GithubCommandExecutor Tests', () => {
    let commandExecutor: GithubCommandExecutor;

    beforeEach(() => {
        commandExecutor = new GithubCommandExecutor();
    })

    afterEach(() => {
        jest.resetAllMocks();
    })

    test('Construct JobSpecificCommandExecutor', () => {
        expect(new GithubCommandExecutor()).toBeDefined();
    })

    describe('GithubCommandExecutor applyPatch Tests', () => {
        test('GithubCommandExecutor applyPatch  succeeds', async() => {
            const testData = TestDataProvider.getPatchCommands("test_repo", "test_patch");
            cp.execSync.mockImplementation((command, options, callback) => Buffer.from('patch applied properly  '));
            let resp = await commandExecutor.applyPatch('test_repo', 'test_patch');
            expect(resp.error).toBe(undefined);
            expect(resp.output).toBe('patch applied properly');
            expect(resp.status).toBe('success');
            expect(cp.execSync.mock.calls[0][0]).toEqual(testData.join(' && '));
            expect(cp.execSync).toBeCalledTimes(1);
        })
    })

    describe('GithubCommandExecutor checkoutBranchForSpecificHead Tests', () => {
        test('GithubCommandExecutor checkoutBranchForSpecificHead  succeeds', async() => {
            const testData = TestDataProvider.getcheckoutBranchForSpecificHeadCommands("test_repo", "test_patch", "test_head");
            cp.execSync.mockImplementation((command, options, callback) => Buffer.from('valid commits'));
            let resp = await commandExecutor.checkoutBranchForSpecificHead("test_repo", "test_patch", "test_head");
            expect(resp.error).toBe(undefined);
            expect(resp.output).toBe('valid commits');
            expect(resp.status).toBe('success');
            expect(cp.execSync.mock.calls[0][0]).toEqual(testData.join(' && '));
            expect(cp.execSync).toBeCalledTimes(1);
        })
    })

    describe('GithubCommandExecutor pullRepo Tests', () => {
        test('GithubCommandExecutor pullRepo with valid head  succeeds', async() => {
            const testData = TestDataProvider.getPullRepoCommands("test_repo", "test_patch", "test_head");
            cp.execSync.mockImplementation((command, options, callback) => Buffer.from('Repo pulled properly'));
            let resp = await commandExecutor.pullRepo("test_repo", "test_patch", "test_head");
            expect(resp.error).toBe(undefined);
            expect(resp.output).toBe('Repo pulled properly' );
            expect(resp.status).toBe('success');
            expect(cp.execSync.mock.calls[0][0]).toEqual(testData.join(' && '));
            expect(cp.execSync).toBeCalledTimes(1);
        })

        test('GithubCommandExecutor pullRepo with no head  succeeds', async() => {
            const testData = TestDataProvider.getPullRepoCommands("test_repo", "test_patch");
            cp.execSync.mockImplementation((command, options, callback) => Buffer.from('Repo pulled properly'));
            let resp = await commandExecutor.pullRepo("test_repo", "test_patch");
            expect(resp.error).toBe(undefined);
            expect(resp.output).toBe("Repo pulled properly");
            expect(resp.status).toBe('success');
            expect(cp.execSync.mock.calls[0][0]).toEqual(testData.join(' && '));
            expect(cp.execSync).toBeCalledTimes(1);
        })
    })
})